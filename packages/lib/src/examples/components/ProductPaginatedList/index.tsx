import { QueryKey } from '@examples/constants';
import { useProductModel } from '@examples/models';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Paginator, ProductItem } from '@examples/components';
import { useDebounce, withQueryKey } from 'react-redux-use-model';

export const ProductPaginatedList: React.FC = withQueryKey(() => {
  const [params, setParams] = useState({ _page: 0, _size: 10, _filter: '' });
  const productModel = useProductModel();
  const productQuery = useSelector(productModel.selectPaginatedQuery);
  const { ids, hasRecords, pagination } = productQuery;

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
            {hasRecords
              ? ids?.map((id, index) => (
                  <ProductItem
                    key={id}
                    index={index}
                    pagination={pagination}
                    productId={id}
                  />
                ))
              : 'No records found...'}
          </div>
          <Paginator
            pagination={pagination}
            onClickPage={(index) => {
              setParams((prev) => ({ ...prev, _page: index }));
            }}
          />
          <pre>
            <code>{JSON.stringify(pagination)}</code>
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
});
