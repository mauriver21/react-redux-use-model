import { ApiTable } from '@components/ApiTable';
import { Body1 } from '@components/Body1';
import { MovieCreateExample1 } from '@components/MovieCreateExample1';
import { ContentsClass, H3, H6, Stack } from 'reactjs-shared-ui';
import { Code, Implementation } from 'reactjs-shared-ui/syntax-highlighter';

export const CreateRecord: React.FC = () => {
  return (
    <Stack spacing={2}>
      <Stack className={ContentsClass.Item} spacing={2}>
        <H3 className={ContentsClass.ItemTitle} fontWeight={500}>
          Create a Record
        </H3>
        <Body1>
          This model action allows you to send a creation request to a backend
          API endpoint, normalize the returned new record, and automatically
          insert it into the Redux store.
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
                <code>ENTITY:CREATE</code>,
                'Action for creating a single record from an API endpoint.',
                <code>POST</code>,
                <code>{'CreateQueryHandler<T>'}</code>,
              ],
            ],
          }}
        />

        <Stack className={ContentsClass.Item} spacing={2}>
          <H6 className={ContentsClass.ItemTitle} fontWeight={500}>
            CreateQueryHandler Constraints
          </H6>
          <Code
            type="path"
            codePath="code-snippets/model-snippet-5.ts"
            language="typescript"
          />
        </Stack>

        <Stack className={ContentsClass.Item} spacing={2}>
          <H6 className={ContentsClass.ItemTitle} fontWeight={500}>
            Create API Client Method
          </H6>
          <Body1>
            The API function takes the entity payload as its first argument and
            optional additional parameters. It must return a promise of type{' '}
            <code>CreateResponse&lt;T&gt;</code>, which wraps the created record
            in a <code>data</code> field.
          </Body1>
          <Code
            type="path"
            codePath="code-snippets/api-client-snippet-3.ts"
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
                codePath: 'models/useMovieModel3/index.ts',
                name: 'useMovieModel.ts',
                language: 'ts',
                mapReplace: {
                  useMovieModel3: 'useMovieModel',
                },
              },
              {
                type: 'path',
                codePath: 'components/MovieCreateExample1/index.tsx',
                name: 'MovieCreate.tsx',
                language: 'tsx',
              },
            ]}
          >
            <MovieCreateExample1 />
          </Implementation>
        </Stack>
      </Stack>
    </Stack>
  );
};
