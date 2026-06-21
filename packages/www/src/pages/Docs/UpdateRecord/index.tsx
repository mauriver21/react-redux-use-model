import { ApiTable } from '@components/ApiTable';
import { Body1 } from '@components/Body1';
import { MovieUpdateExample1 } from '@components/MovieUpdateExample1';
import { ContentsClass, H3, H6, Stack } from 'reactjs-shared-ui';
import { Code, Implementation } from 'reactjs-shared-ui/syntax-highlighter';

export const UpdateRecord: React.FC = () => {
  return (
    <Stack spacing={2}>
      <Stack className={ContentsClass.Item} spacing={2}>
        <H3 className={ContentsClass.ItemTitle} fontWeight={500}>
          Update a Record
        </H3>
        <Body1>
          This model action allows you to send an update request to a backend
          API endpoint, normalize the returned updated record, and automatically
          sync it across all references in the Redux store.
        </Body1>
        <ApiTable
          data={{
            columnNames: [
              'Action Name',
              'Description',
              'HTTP Verb',
              'TS Handler Type',
            ],
            rows: [
              [
                <code>ENTITY:UPDATE</code>,
                'Action for updating a single record from an API endpoint.',
                <code>PUT</code>,
                <code>{'UpdateQueryHandler<T>'}</code>,
              ],
            ],
          }}
        />

        <Stack className={ContentsClass.Item} spacing={2}>
          <H6 className={ContentsClass.ItemTitle} fontWeight={500}>
            UpdateQueryHandler Constraints
          </H6>
          <Code
            type="path"
            codePath="code-snippets/model-snippet-6.ts"
            language="typescript"
          />
        </Stack>

        <Stack className={ContentsClass.Item} spacing={2}>
          <H6 className={ContentsClass.ItemTitle} fontWeight={500}>
            Update API Client Method
          </H6>
          <Body1>
            The API function takes the entity ID and payload as arguments. It
            must return a promise of type <code>UpdateResponse&lt;T&gt;</code>.
          </Body1>
          <Code
            type="path"
            codePath="code-snippets/api-client-snippet-4.ts"
            language="typescript"
          />
        </Stack>
        <Stack pt={2} className={ContentsClass.Item} spacing={2}>
          <H6 className={ContentsClass.ItemTitle} fontWeight={500}>
            Live Interactive Example
          </H6>
          <Implementation
            multipleCode
            codeTabs={[
              {
                type: 'path',
                codePath: 'models/useMovieModel4/index.ts',
                name: 'useMovieModel.ts',
                language: 'ts',
                mapReplace: {
                  useMovieModel4: 'useMovieModel',
                },
              },
              {
                type: 'path',
                codePath: 'components/MovieUpdateExample1/index.tsx',
                name: 'MovieUpdate.tsx',
                language: 'tsx',
                mapReplace: {
                  useMovieModel4: 'useMovieModel',
                },
              },
              {
                type: 'path',
                codePath: 'components/MovieUpdateRow/index.tsx',
                name: 'MovieUpdateRow.tsx',
                language: 'tsx',
                mapReplace: {
                  useMovieModel4: 'useMovieModel',
                },
              },
            ]}
          >
            <MovieUpdateExample1 />
          </Implementation>
        </Stack>
      </Stack>
    </Stack>
  );
};
