import AppBar, { AppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { MAIN_LAYOUT_MAX_WIDTH } from '@constants/constants';
import { GITHUB_URL, NPM_URL } from '@constants/urls';
import { Link, Stack } from 'reactjs-shared-ui';
import { Body1 } from '@components/Body1';

export interface MainToolbar extends AppBarProps {}

export const MainToolbar: React.FC<MainToolbar> = ({
  position = 'sticky',
  elevation = 0,
  sx,
  ...rest
}) => {
  return (
    <AppBar
      {...rest}
      sx={{ bgcolor: 'secondary.main', ...sx }}
      position={position}
      elevation={elevation}
    >
      <Toolbar>
        <Stack
          width="100%"
          direction="row"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          maxWidth={MAIN_LAYOUT_MAX_WIDTH}
          margin="auto"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Link to="/">
              <Body1 color="text.primary" fontWeight={500}>
                react-redux-use-model
              </Body1>
            </Link>
            <Link to="/docs/introduction">
              <Body1 fontWeight={500}>Docs</Body1>
            </Link>
            {/* <Link to="/api">
              <Body1 fontWeight={500}>API</Body1>
            </Link> */}
          </Stack>
          <Stack direction="row" spacing={0} alignItems="center">
            <IconButton
              disableRipple
              component="a"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              <svg
                viewBox="0 0 24 24"
                width="38"
                height="38"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </IconButton>
            <IconButton
              disableRipple
              component="a"
              href={NPM_URL}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 256 256"
                version="1.1"
                preserveAspectRatio="xMidYMid"
              >
                <g>
                  <polygon
                    fill="currentColor"
                    points="0 256 0 0 256 0 256 256"
                  ></polygon>
                  <polygon points="48 48 208 48 208 208 176 208 176 80 128 80 128 208 48 208"></polygon>
                </g>
              </svg>
            </IconButton>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
