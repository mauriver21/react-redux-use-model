import { Body1 } from '@components/Body1';
import { ContentsClass, H3, Stack } from 'reactjs-shared-ui';

export const UpdateRecord: React.FC = () => {
  return (
    <Stack spacing={2}>
      <Stack className={ContentsClass.Item} spacing={2}>
        <H3 className={ContentsClass.ItemTitle} fontWeight={500}>
          Update a Record
        </H3>
        <Body1>Component Works!</Body1>
      </Stack>
    </Stack>
  );
};
