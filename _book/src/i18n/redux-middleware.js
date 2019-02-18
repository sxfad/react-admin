import {setMenuI18n} from '@/commons';
import {setCurrentLocal} from "@/i18n/index";
import allI18n from "@/i18n/index";

export default store => next => action => {
    const result = next(action);
    const nextState = store.getState();
    const menuState = nextState?.menu || {};
    const pageState = nextState?.page || {};
    const systemState = nextState?.system || {};

    const i18n = systemState.i18n;

    if (!i18n) return result;

    const setLocalActionType = systemState.__actionTypes?.setLocal;
    const setTabsActionType = systemState.__actionTypes?.setTabs;
    const setMenusActionType = menuState.__actionTypes?.setMenus;
    const setTitleActionType = pageState.__actionTypes?.setTitle;
    const setBreadcrumbsActionType = pageState.__actionTypes?.setBreadcrumbs;

    const nextLocal = systemState.local;
    const tabs = systemState.tabs;
    const menus = menuState.menus || [];
    const title = pageState.title;
    const breadcrumbs = pageState.breadcrumbs;

    if (action.type === setLocalActionType) {
        setCurrentLocal(allI18n.find(item => item.local === nextLocal)?.i18n || {});
        setMenuLocal();
        setTitleLocal();
        setBreadcrumbsLocal();
        setTabsLocal();
    }

    function setMenuLocal() {
        const localedMenus = setMenuI18n(menus, i18n.menu);
        store.dispatch({
            type: setMenusActionType,
            payload: localedMenus,
        });

    }

    function setTitleLocal() {
        if (title && title.local) {
            const text = i18n.menu[title.local];
            if (text) {
                title.text = text;
                store.dispatch({
                    type: setTitleActionType,
                    payload: title,
                });
            }
        }
    }

    function setTabsLocal() {
        const newTabs = tabs.map(item => {
            let {text} = item;
            const newText = i18n.menu[text?.local];

            if (newText) {
                text = {...text, text: newText};
                return {...item, text};
            }

            return {...item};
        });

        store.dispatch({
            type: setTabsActionType,
            payload: newTabs,
        });
    }

    function setBreadcrumbsLocal() {
        if (breadcrumbs && breadcrumbs.length) {
            const localedBreadcrumbs = breadcrumbs.map(item => {
                if (item.local) {
                    const text = i18n.menu[item.local];
                    if (text) return {...item, text};
                }
                return {...item};
            });

            store.dispatch({
                type: setBreadcrumbsActionType,
                payload: localedBreadcrumbs,
            })
        }
    }

    return result
}
