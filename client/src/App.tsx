import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { colorTheme } from './styling/colorTheme';
import { ThemeProvider } from '@material-ui/core';
import ChatRoomMain from './components/chatRoomMain';
import ChatProvider from './contexts/chatContext';
import LoginPage from './routes/loginPage';

function App() {
	// connect  socket.io here in useEffect()
	return (
		<ChatProvider>
			<ThemeProvider theme={colorTheme}>
				<Router>
					<Switch>
						<Route path='/chatroommain' component={ChatRoomMain}></Route>
						<Route exact path='/' component={LoginPage}></Route>
					</Switch>
				</Router>
			</ThemeProvider>
		</ChatProvider>
	);
}

export default App;

// const theme = createMuiTheme({
// 	breakpoints: {
// 		values: {
// 			xs: 0,
// 			sm: 600,
// 			md: 960,
// 			lg: 1280,
// 			xl: 1920,
// 		},
// 	},
// });
