import { EntityActionType } from '@constants';
import {
  Entity,
  ModelMethodParameters,
  Pagination,
  QueryHandlers,
} from '@interfaces';

export type QueryState<TEntity extends Entity = Entity> = {
  ids: Array<Exclude<TEntity['id'], undefined>>;
  queryKey: string;
  initialLoading: boolean;
  loading: boolean;
  listing: boolean;
  creating: boolean;
  updating: boolean;
  reading: boolean;
  removing: boolean;
  hasRecords: boolean;
  timestamp?: number;
  paginationParams?: ModelMethodParameters<
    TEntity,
    QueryHandlers<TEntity>[string],
    EntityActionType.LIST
  >[0]['paginationParams'];
  pagination?: Pagination;
  calculatedPagination?: Pagination;
  currentPage?: number;
  calculatedCurrentPage?: number;
  cache?: Array<{
    id: string;
    expirationTimestamp: number;
    cachedResponse: any;
  }>;
};
