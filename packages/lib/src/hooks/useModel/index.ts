import { EntityActionType, EntityHelperActionType, ListMode } from '@constants';
import {
  EntityAction,
  RootState,
  QueryState,
  StringKey,
  NormalizedState,
  AnyObject,
  BuildModelMethodOptions,
  ListQueryHandler,
  CreateQueryHandler,
  UpdateQueryHandler,
  RemoveQueryHandler,
  ReadQueryHandler,
  ReadResponse,
  Entity,
  Id,
} from '@interfaces';
import { Dispatch, createSelector } from '@reduxjs/toolkit';
import {
  calcPageSize,
  calcPage,
  paginateData,
  useModelContext,
  calcTotalPages,
  useQueryKey,
  isLastPage,
  isPageBlank,
  now,
  updateQueryListMode,
} from '@utils';
import { useApiClients } from '@hooks';
import { useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';
import {
  CreateResponse,
  ExtractHandler,
  ExtractQueryHandlerApiFnParameters,
  InvalidateQueryStrategy,
  ListResponse,
  ModelMethodParameters,
  ModelSchema,
  NormalizeEntity,
  QueryHandler,
  QueryHandlers,
  RemoveResponse,
  UpdateResponse,
} from '@interfaces';

export const useModel = <
  TEntity extends Entity,
  TQueryHandlers extends QueryHandlers<TEntity>
>(params: {
  handlers: TQueryHandlers;
  entityName: string;
  schema?: ModelSchema<TEntity>;
  config?: {
    paginationSizeMultiplier?: number;
    initialLoadingSize?: number;
    mode?: ListMode;
  };
}) => {
  const queryKey = useQueryKey();
  const [_, setRefresh] = useState(0);
  const ref = useRef({ queryKey: '', ...queryKey.ref?.current });
  const { handlers, entityName, schema, config } = params;
  const { paginationSizeMultiplier = 5, initialLoadingSize = 10 } =
    config || {};
  const { findQuery, findEntity, findEntityState } = useModelContext();

  /**
   * Extract the apis from the handlers.
   */
  const apis = useMemo(() => {
    const apisFns = {} as {
      [K in keyof TQueryHandlers]: TQueryHandlers[K]['apiFn'];
    };
    const keys = Object.keys(handlers) as Array<keyof TQueryHandlers>;
    for (const key of keys) {
      apisFns[key] = handlers[key]['apiFn'];
    }

    return apisFns;
  }, []);

  const { runApi, state } = useApiClients(apis);

  /**
   * Dispatch initialization.
   */
  const dispatch = useDispatch<Dispatch<EntityAction<TEntity>>>();

  /**
   * Get the query key from the ref.
   */
  const getQueryKey = () => ref.current.queryKey;

  /**
   * Set the query key from the ref.
   */
  const setQueryKey = (queryKey: string) => {
    ref.current.queryKey = queryKey;
    setRefresh(now());
  };

  /**
   * Method for invalidating a query.
   */
  const isQueryInvalidated = (
    options: InvalidateQueryStrategy | undefined,
    params: { _filterPrev?: string; _filter?: string; force?: boolean }
  ) => {
    switch (options?.strategy) {
      case 'always':
        return true;
      case 'onFilterChange':
        return params._filterPrev !== params._filter || params.force;
      case 'custom':
        return options.when();
      default:
        return false;
    }
  };

  /**
   * Reset a query key.
   */
  const dispatchInvalidateQuery = (params: {
    queryKey: string;
    ids: Array<string | number>;
  }) => {
    dispatch({
      type: EntityHelperActionType.INVALIDATE_QUERY,
      entityName,
      initialLoadingSize,
      ...params,
    });
  };

  /**
   * Update a query loader.
   */
  const dispatchUpdateQueryLoaders = (params: {
    queryKey: string;
    loading?: boolean;
    listing?: boolean;
    creating?: boolean;
    updating?: boolean;
    removing?: boolean;
    reading?: boolean;
  }) => {
    dispatch({
      type: EntityHelperActionType.UPDATE_QUERY_LOADERS,
      entityName,
      ...params,
    });
  };

  /**
   * Dispatch a list of entities.
   */
  const dispatchList = (params: {
    entities: Array<any>;
    queryKey: string;
    pagination?: QueryState['pagination'];
    currentPage?: number;
    params: any;
    sizeMultiplier?: number;
    invalidatedQuery?: boolean;
  }) => {
    dispatch({
      type: EntityActionType.LIST,
      entityName,
      schema,
      ...params,
    });
  };

  /**
   * Dispatch a created entity.
   */
  const dispatchCreate = (params: {
    entity: any;
    queryKey: string | undefined;
  }) => {
    dispatch({
      type: EntityActionType.CREATE,
      entityName,
      schema,
      ...params,
    });
  };

  /**
   * Dispatch an updated entity.
   */
  const dispatchUpdate = (params: { entity: any; prevEntity: any }) => {
    dispatch({
      type: EntityActionType.UPDATE,
      entityName,
      schema,
      ...params,
    });
  };

  /**
   * Dispatch an read entity.
   */
  const dispatchRead = (params: { entity: any }) => {
    dispatch({
      type: EntityActionType.READ,
      entityName,
      schema,
      ...params,
    });
  };

  /**
   * Dispatch remove operation.
   */
  const dispatchRemove = (params: { entityId: string | number }) => {
    dispatch({
      type: EntityActionType.REMOVE,
      entityName,
      schema,
      ...params,
    });
  };

  /**
   * Initialize model methods.
   */
  const buildModelMethods = () => {
    const modelMethods: AnyObject = {};
    const keys = Object.keys(handlers);

    for (const key of keys) {
      modelMethods[key] = buildModelMethod(
        key as StringKey<keyof TQueryHandlers>,
        handlers[key as keyof TQueryHandlers]
      );

      modelMethods[`${key}WithResponse`] = buildModelMethod(
        key as StringKey<keyof TQueryHandlers>,
        handlers[key as keyof TQueryHandlers],
        { withResponse: true }
      );
    }

    return modelMethods as {
      [K in keyof TQueryHandlers]: (
        ...params: ModelMethodParameters<
          TEntity,
          TQueryHandlers[K],
          TQueryHandlers[K]['action']
        >
      ) => Promise<void>;
    } & {
      [K in keyof TQueryHandlers as `${StringKey<K>}WithResponse`]: (
        ...params: ModelMethodParameters<
          TEntity,
          TQueryHandlers[K],
          TQueryHandlers[K]['action']
        >
      ) => ReturnType<TQueryHandlers[K]['apiFn']>;
    };
  };

  /**
   * Get the pagination from the cached params inside a query.
   */
  const getCachedPaginationParams = (queryKey: string) => {
    const query = findQuery(entityName, queryKey);
    const params = query?.params as
      | ModelMethodParameters<
          TEntity,
          TQueryHandlers[string],
          EntityActionType.LIST
        >
      | undefined;

    return params?.[0]?.paginationParams;
  };

  /**
   * Get the current page from the query.
   */
  const getCurrentPage = (queryKey: string) => {
    const query = findQuery(entityName, queryKey);
    return query?.currentPage;
  };

  /**
   * Build the list method.
   */
  const buildListMethod = (
    handlerName: StringKey<keyof TQueryHandlers>,
    handler: ListQueryHandler<TEntity>,
    methodOptions?: BuildModelMethodOptions
  ) => {
    return async (
      ...params: ModelMethodParameters<
        TEntity,
        TQueryHandlers[string],
        EntityActionType.LIST
      >
    ) => {
      const [options, ...restParams] = params;
      const prevQueryKey = getQueryKey();
      const prevQuery = findQuery(entityName, prevQueryKey);
      const timestamp = now();

      setQueryKey(options.queryKey);

      const queryKey = getQueryKey();
      const foundQuery = findQuery(entityName, queryKey);

      const cachedPaginationParams = getCachedPaginationParams(queryKey);
      const cacheSeconds =
        options.paginationParams._cacheSeconds ||
        cachedPaginationParams?._cacheSeconds ||
        0;
      const requestParams = [options.paginationParams];
      const cacheId = JSON.stringify(requestParams);
      const cache = foundQuery?.cache?.find((item) => item.id == cacheId);
      const ms = cacheSeconds * 1000;
      const future = new Date(timestamp + ms);
      const expirationTimestamp = future.getTime();
      const cacheExpired = (cache?.expirationTimestamp || 0) <= timestamp;

      if (methodOptions?.withResponse !== true && cacheExpired !== true) {
        return cache?.cachedResponse;
      }

      updateQueryListMode({ entityName, queryKey }, options?.mode);

      /**
       * Query is initialized if no prev query exists.
       */
      if (foundQuery === undefined) {
        dispatchInitializeQuery({ queryKey, timestamp });
      }

      /**
       * Cache timestamp is updated
       */
      if (cacheSeconds && cacheExpired) {
        dispatchQueryCache({
          queryKey,
          expirationTimestamp,
          requestParams,
        });
      }

      const page = options.paginationParams?._page || 0;
      const size =
        options.paginationParams?._size || cachedPaginationParams?._size || 10;

      const sizeMultiplier = paginationSizeMultiplier || 1;

      if (queryKey) {
        dispatchGoToPage({
          queryKey,
          page,
          size,
          sizeMultiplier,
        });
      }

      if (
        prevQuery &&
        prevQueryKey !== queryKey &&
        options.invalidateQuery &&
        options.invalidateQuery.strategy === 'onFilterChange' &&
        isQueryInvalidated(options.invalidateQuery, { force: true })
      ) {
        dispatchInvalidateQuery({ queryKey, ids: prevQuery?.ids || [] });
      }

      try {
        dispatchUpdateQueryLoaders({ queryKey, listing: true });
        const { _cacheSeconds, ...restPaginationParams } =
          options.paginationParams;

        const response = (await runApi({
          apiName: handlerName,
          throwError: true,
          params: [
            {
              ...restPaginationParams,
              _page: calcPage({
                page,
                size,
                sizeMultiplier,
              }),
              _size: calcPageSize({
                size,
                sizeMultiplier,
              }),
            },
            ...restParams,
          ] as unknown as ExtractQueryHandlerApiFnParameters<
            TEntity,
            TQueryHandlers[string],
            EntityActionType.LIST
          >,
        })) as ListResponse<TEntity>;

        const invalidatedQuery = isQueryInvalidated(options?.invalidateQuery, {
          _filter: options.paginationParams._filter,
          _filterPrev: cachedPaginationParams?._filter,
        });

        dispatchList({
          entities: response?.data || [],
          invalidatedQuery,
          queryKey,
          pagination: response?.pagination
            ? {
                ...response.pagination,
                page,
                size,
                totalPages: calcTotalPages({
                  totalElements: response.pagination.totalElements,
                  size,
                }),
              }
            : undefined,
          currentPage: getCurrentPage(queryKey),
          params,
          sizeMultiplier,
        });

        if (cacheSeconds && cacheExpired) {
          dispatchQueryCache({
            queryKey,
            expirationTimestamp,
            requestParams,
            cachedResponse: response,
          });
        }

        if (methodOptions?.withResponse) {
          return response;
        } else {
          handler?.onSuccess?.(response);
        }
      } catch (error) {
        if (methodOptions?.withResponse) {
          throw error;
        } else {
          handler?.onError?.(error);
        }
      } finally {
        dispatchUpdateQueryLoaders({
          queryKey,
          listing: false,
          loading: false,
        });
      }
    };
  };

  /**
   * Build the create method.
   */
  const buildCreateMethod = (
    handlerName: StringKey<keyof TQueryHandlers>,
    handler: CreateQueryHandler<TEntity>,
    methodOptions?: BuildModelMethodOptions
  ) => {
    return async (
      ...params: ModelMethodParameters<
        TEntity,
        TQueryHandlers[string],
        EntityActionType.CREATE
      >
    ) => {
      const queryKey = getQueryKey();

      try {
        dispatchUpdateQueryLoaders({ queryKey, creating: true });
        const response = (await runApi({
          apiName: handlerName,
          params,
          throwError: true,
        })) as CreateResponse<TEntity>;

        dispatchCreate({ entity: response.data, queryKey });

        if (methodOptions?.withResponse) {
          return response;
        } else {
          handler?.onSuccess?.(response);
        }
      } catch (error) {
        if (methodOptions?.withResponse) {
          throw error;
        } else {
          handler?.onError?.(error);
        }
      } finally {
        dispatchUpdateQueryLoaders({ queryKey, creating: false });
      }
    };
  };

  /**
   * Build the update method
   */
  const buildUpdateMethod = (
    handlerName: StringKey<keyof TQueryHandlers>,
    handler: UpdateQueryHandler<TEntity>,
    methodOptions?: BuildModelMethodOptions
  ) => {
    return async (
      ...params: ModelMethodParameters<
        TEntity,
        TQueryHandlers[string],
        EntityActionType.UPDATE
      >
    ) => {
      const queryKey = getQueryKey();

      try {
        dispatchUpdateQueryLoaders({ queryKey, updating: true });
        const [entityId] = params;
        const prevEntity = findEntity(entityName, entityId);
        const response = (await runApi({
          apiName: handlerName,
          params,
          throwError: true,
        })) as UpdateResponse<TEntity>;

        dispatchUpdate({ entity: response.data, prevEntity });

        if (methodOptions?.withResponse) {
          return response;
        } else {
          handler?.onSuccess?.(response);
        }
      } catch (error) {
        if (methodOptions?.withResponse) {
          throw error;
        } else {
          handler?.onError?.(error);
        }
      } finally {
        dispatchUpdateQueryLoaders({ queryKey, updating: false });
      }
    };
  };

  /**
   * Build the read method
   */
  const buildReadMethod = (
    handlerName: StringKey<keyof TQueryHandlers>,
    handler: ReadQueryHandler<TEntity>,
    methodOptions?: BuildModelMethodOptions
  ) => {
    return async (
      ...params: ModelMethodParameters<
        TEntity,
        TQueryHandlers[string],
        EntityActionType.READ
      >
    ) => {
      const queryKey = getQueryKey();

      try {
        dispatchUpdateQueryLoaders({ queryKey, reading: true });

        const response = (await runApi({
          apiName: handlerName,
          params,
          throwError: true,
        })) as ReadResponse<TEntity>;

        dispatchRead({ entity: response.data });

        if (methodOptions?.withResponse) {
          return response;
        } else {
          handler?.onSuccess?.(response);
        }
      } catch (error) {
        if (methodOptions?.withResponse) {
          throw error;
        } else {
          handler?.onError?.(error);
        }
      } finally {
        dispatchUpdateQueryLoaders({ queryKey, reading: false });
      }
    };
  };

  /**
   * Build the remove method.
   */
  const buildRemoveMethod = (
    handlerName: StringKey<keyof TQueryHandlers>,
    handler: RemoveQueryHandler<TEntity>,
    methodOptions?: BuildModelMethodOptions
  ) => {
    return async (
      ...params: ModelMethodParameters<
        TEntity,
        TQueryHandlers[string],
        EntityActionType.REMOVE
      >
    ) => {
      const queryKey = getQueryKey();

      try {
        dispatchUpdateQueryLoaders({ queryKey, removing: true });

        const [entityId] = params;
        const response = (await runApi({
          apiName: handlerName,
          params,
          throwError: true,
        })) as RemoveResponse<TEntity>;

        dispatchRemove({
          entityId: response.data?.id || entityId,
        });

        const entityState = findEntityState(entityName);
        const queries = entityState?.queries || [];

        for (const query of queries) {
          if (query.pagination && query.pagination.page == query.currentPage) {
            /**
             * Page is decreased in one on every query if it's detected that the
             * current page is the last page and if the current page is blank.
             */
            if (
              isLastPage(query.pagination) &&
              query.pagination.page == query.currentPage &&
              isPageBlank(query.pagination)
            ) {
              const queryKey = query.queryKey;
              const cachedPaginationParams =
                getCachedPaginationParams(queryKey);
              dispatchGoToPage({
                queryKey,
                page:
                  query.currentPage > 0
                    ? query.currentPage - 1
                    : query.currentPage,
                size: cachedPaginationParams?._size || 10,
                sizeMultiplier: paginationSizeMultiplier,
              });
            }
          }
        }

        if (methodOptions?.withResponse) {
          return response;
        } else {
          handler?.onSuccess?.(response);
        }
      } catch (error) {
        if (methodOptions?.withResponse) {
          throw error;
        } else {
          handler?.onError?.(error);
        }
      } finally {
        dispatchUpdateQueryLoaders({ queryKey, removing: false });
      }
    };
  };

  /**
   * Orchestrate the api function with the state dispatcher.
   */
  const buildModelMethod = (
    handlerName: StringKey<keyof TQueryHandlers>,
    handler: QueryHandler<TEntity>,
    options?: BuildModelMethodOptions
  ) => {
    switch (handler.action) {
      case EntityActionType.LIST:
        return buildListMethod(handlerName, handler, options);
      case EntityActionType.CREATE:
        return buildCreateMethod(handlerName, handler, options);
      case EntityActionType.UPDATE:
        return buildUpdateMethod(handlerName, handler, options);
      case EntityActionType.READ:
        return buildReadMethod(handlerName, handler, options);
      case EntityActionType.REMOVE:
        return buildRemoveMethod(handlerName, handler, options);
      default:
        return async () => {};
    }
  };
  /**
   * Handles cache pagination to specific page.
   */
  const dispatchGoToPage = (params: {
    queryKey: string;
    page: number;
    size: number;
    sizeMultiplier: number;
  }) => {
    dispatch({
      type: EntityHelperActionType.GO_TO_PAGE,
      entityName,
      ...params,
    });
  };

  /**
   * Handles query initialization.
   */
  const dispatchInitializeQuery = (params: {
    queryKey: string;
    timestamp: number;
  }) => {
    dispatch({
      type: EntityHelperActionType.INITIALIZE_QUERY,
      entityName,
      initialLoadingSize,
      ...params,
    });
  };

  /**
   * Handles query initialization.
   */
  const dispatchQueryCache = (params: {
    queryKey: string;
    expirationTimestamp: number;
    requestParams: Array<any>;
    cachedResponse?: any;
  }) => {
    dispatch({
      type: EntityHelperActionType.QUERY_CACHE,
      entityName,
      ...params,
    });
  };

  /**
   * Selects normalized entity state by the entity name.
   */
  const selectNormalizedEntityState = (state: RootState) =>
    state.normalizedEntitiesState[entityName];

  /**
   * Select all loaded entities from the normalized list.
   */
  const selectAllEntities = createSelector(
    [selectNormalizedEntityState],
    (state) => {
      return Object.values(state?.byId || {}) as Array<
        NormalizeEntity<TEntity>
      >;
    }
  );

  /**
   * Select multiple entities values from the normalized list.
   */
  const selectEntities = createSelector(
    [
      selectNormalizedEntityState,
      (_: RootState, ids: Array<Id> | null | undefined) => ids,
    ],
    (state, ids) => {
      const entities: Array<ReturnType<typeof buildSelectedEntity>> = [];
      if (ids) {
        for (const id of ids) {
          entities.push(buildSelectedEntity(state, id));
        }
      }

      return entities;
    }
  );

  /**
   * Util function for building the selected entity for entities selectors.
   */
  const buildSelectedEntity = (
    state: NormalizedState | undefined,
    entityId?: string | number
  ) => {
    entityId = entityId || emptyId();
    const loading = state?.byId?.[entityId] === undefined;
    const data = (entityId ? state?.byId?.[entityId] : undefined) as
      | NormalizeEntity<TEntity>
      | undefined;

    return { id: entityId, data, loading };
  };

  /**
   * Select an entity value from the normalized list.
   */
  const selectEntity = createSelector(
    [selectNormalizedEntityState, (_: RootState, id?: string | number) => id],
    (state, id) => buildSelectedEntity(state, id)
  );

  /**
   * All queries selector from an entity state.
   */
  const selectQueries = createSelector(
    [selectNormalizedEntityState],
    (state) => state?.queries
  );

  /**
   * Helper function that generates a random empty id.
   */
  const emptyId = () => `empty-${uuid()}`;

  /**
   * Helper function that generates random empty ids.
   */
  const buildEmptyIds = (size: number) => {
    return Array(size)
      .fill(null)
      .map(() => emptyId());
  };

  /**
   * Select the query.
   */
  const selectQuery = createSelector(
    [selectQueries, (_: RootState, queryKey?: string) => queryKey],
    (queries, queryKey) => {
      queryKey = queryKey || getQueryKey();
      const query = queries?.find((item) => item.queryKey == queryKey);
      return {
        ...query,
        ids: query?.ids?.map((item) => {
          if (item === null || item === undefined) return emptyId();
          return item;
        }),
      } as QueryState<
        TEntity,
        Parameters<
          ExtractHandler<
            TEntity,
            TQueryHandlers,
            EntityActionType.LIST
          >['apiFn']
        >
      >;
    }
  );

  /**
   * Select pagination params
   */
  const selectPaginationParams = createSelector([selectQuery], (query) => {
    const paginationParams = query?.params?.[0];
    return {
      ...paginationParams,
      _size: paginationParams?._size || 10,
      _page: paginationParams?._page || 0,
    };
  });

  /**
   * Select the paginated query.
   */
  const selectPaginatedQuery = createSelector([selectQuery], (query) => {
    if (query?.pagination) {
      const calculatedSize = query.calculatedPagination?.size || 0;
      const { size, page } = query.pagination;
      const sizeMultiplier = calculatedSize / size;
      const records = size * page;
      const factor = Math.floor(records / calculatedSize);
      const calculatedPage = page - sizeMultiplier * factor;

      const { content: ids } = paginateData(query?.ids || [], {
        page: calculatedPage,
        limit: size,
      });

      return { ...query, ids };
    }

    return { ...query, ids: buildEmptyIds(initialLoadingSize) };
  });

  return {
    ...buildModelMethods(),
    ...state,
    selectEntity,
    selectEntities,
    selectAllEntities,
    selectPaginatedQuery,
    selectQuery,
    selectPaginationParams,
  };
};
