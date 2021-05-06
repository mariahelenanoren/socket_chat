import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { colorTheme } from './styling/colorTheme';
import { ThemeProvider } from '@material-ui/core';
import ChatProvider from './contexts/chatContext';
import TestPage from './testPage';
import loginPage from './routes/loginPage';

function App() {
	return (
		<ChatProvider>
			<ThemeProvider theme={colorTheme}>
				<Router>
					<Switch>
						<Route exact path='/' component={TestPage} />
						<Route path='/loginPage' component={loginPage}></Route>
						<Route></Route>
					</Switch>
				</Router>
			</ThemeProvider>
		</ChatProvider>
	);
}

export default App;
