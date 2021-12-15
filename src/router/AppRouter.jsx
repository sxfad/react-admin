import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import { LayoutError404 as Error404, AdminLayout as Layout, SubApp } from '../components';
import { BASE_NAME, CONFIG_HOC, HASH_ROUTER } from 'src/config';
import routes from './routes';
import { Footer } from 'src/components';

const Router = HASH_ROUTER ? HashRouter : BrowserRouter;
const baseName = HASH_ROUTER ? '' : BASE_NAME;

export default function AppRouter(props) {
    const { menus, collectedMenus, onMenuCollect } = props;

    return (
        <Router basename={baseName}>
            <Route
                path="/"
                render={(props) => {
                    return (
                        <Layout
                            {...props}
                            routes={routes}
                            render404={(props) => <Error404 {...props} />}
                            baseName={baseName}
                            menus={menus}
                            collectedMenus={collectedMenus}
                            onMenuCollect={onMenuCollect}
                        />
                    );
                }}
            />
            {!CONFIG_HOC.keepAlive ? (
                <Switch>
                    {routes.map((item) => {
                        const { path, component } = item;

                        return <Route key={path} exact path={path} component={component} />;
                    })}
                    <Route component={Error404} />
                </Switch>
            ) : null}
            <SubApp />
            <Footer />
        </Router>
    );
}
