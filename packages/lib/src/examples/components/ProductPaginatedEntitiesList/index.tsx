import { QueryKey } from '@examples/constants';
import { useProductModel } from '@examples/models';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Paginator, ProductItem } from '@examples/components';
import { PaginationParams, RootState } from '@interfaces';
import { useDebounce } from '@utils';

export const ProductPaginatedEntitiesList: React.FC = () => {
  const [params, setParams] = useState<PaginationParams>({
    _page: 0,
    _size: 10,
  });
  const productModel = useProductModel();
  const productQuery = useSelector(productModel.selectPaginatedQuery);
  const entities = useSelector((state: RootState) =>
    productModel.selectEntities(state, productQuery.ids),
  );

  const search = useDebounce((criteria: string) => {
    setParams({
      _page: 0,
      _size: 10,
      _filter: criteria,
    });
  });

  useEffect(() => {
    if (params._filter) {
      productModel.list({
        queryKey: QueryKey.ProductPaginatedFilteredList,
        paginationParams: params,
        invalidateQuery: { strategy: 'onFilterChange' },
      });
    } else {
      productModel.list({
        queryKey: QueryKey.ProductPaginatedList,
        paginationParams: params,
      });
    }
  }, [params]);

  return (
    <div>
      <input
        placeholder="Search..."
        onChange={(event) => search(event.target.value)}
      />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            border: '1px solid black',
            overflow: 'auto',
            width: 500,
            height: 600,
            padding: 10,
          }}
        >
          <div>
            {entities.map((entity, index) => (
              <ProductItem
                pagination={productQuery.pagination}
                key={entity.id}
                index={index}
                productId={entity.id}
              />
            ))}
          </div>
          <Paginator
            pagination={productQuery?.pagination}
            onClickPage={(index) => {
              setParams((prev) => ({ ...prev, _page: index }));
            }}
          />
          <pre>
            <code>{JSON.stringify(productQuery?.pagination)}</code>
          </pre>
        </div>
        <pre
          style={{
            border: '1px solid black',
            overflow: 'auto',
            width: 500,
            height: 600,
            padding: 10,
            marginLeft: 20,
          }}
        >
          <code>{JSON.stringify(productQuery, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};
