import { ApiTable } from '@components/ApiTable';
import { Body1 } from '@components/Body1';
import { MovieRemoveExample1 } from '@components/MovieRemoveExample1';
import { ContentsClass, H3, H6, Stack } from 'reactjs-shared-ui';
import { Code, Implementation } from 'reactjs-shared-ui/syntax-highlighter';

export const RemoveRecord: React.FC = () => {
  return (
    <Stack spacing={2}>
      <Stack className={ContentsClass.Item} spacing={2}>
        <H3 className={ContentsClass.ItemTitle} fontWeight={500}>
          Remove a Record
        </H3>
        <Body1>
          This model action allows you to send a delete request to a backend API
          endpoint, normalize the deleted record status, and automatically
          remove it from the Redux store, propagating updates to all components
          instantly.
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
                <code>ENTITY:REMOVE</code>,
                'Action for deleting a single record from an API endpoint.',
                <code>DELETE</code>,
                <code>{'RemoveQueryHandler<T>'}</code>,
              ],
            ],
          }}
        />

        <Stack className={ContentsClass.Item} spacing={2}>
          <H6 className={ContentsClass.ItemTitle} fontWeight={500}>
            RemoveQueryHandler Constraints
          </H6>
          <Code
            type="path"
            codePath="code-snippets/model-snippet-7.ts"
            language="typescript"
          />
        </Stack>

        <Stack className={ContentsClass.Item} spacing={2}>
          <H6 className={ContentsClass.ItemTitle} fontWeight={500}>
            Remove API Client Method
          </H6>
          <Body1>
            The API function takes the entity ID to be deleted. It must return a
            promise of type <code>RemoveResponse&lt;T&gt;</code>.
          </Body1>
          <Code
            type="path"
            codePath="code-snippets/api-client-snippet-5.ts"
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
                codePath: 'models/useMovieModel5/index.ts',
                name: 'useMovieModel.ts',
                language: 'ts',
                mapReplace: {
                  useMovieModel5: 'useMovieModel',
                },
              },
              {
                type: 'path',
                codePath: 'components/MovieRemoveExample1/index.tsx',
                name: 'MovieRemove.tsx',
                language: 'tsx',
                mapReplace: {
                  useMovieModel5: 'useMovieModel',
                },
              },
              {
                type: 'path',
                codePath: 'components/MovieRemoveRow/index.tsx',
                name: 'MovieRemoveRow.tsx',
                language: 'tsx',
                mapReplace: {
                  useMovieModel5: 'useMovieModel',
                },
              },
            ]}
          >
            <MovieRemoveExample1 />
          </Implementation>
        </Stack>
      </Stack>
    </Stack>
  );
};
