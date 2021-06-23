import React, {useState, useEffect, useRef} from 'react';
import {Input, Select, Empty} from 'antd';
import {AppstoreOutlined} from '@ant-design/icons';
import {debounce} from 'lodash';
import {scrollElement, elementIsVisible, filterTree} from '../util';
import {getComponents, getStores} from '../dataSource';
import config from 'src/commons/config-hoc';
import ComponentItem from './ComponentItem';
import Draggable from './Draggable';
import Pane from '../pane';

import styles from './style.less';

export default config({
    connect: state => {
        return {
            stores: state.componentStore.stores,
            store: state.componentStore.store,
            categories: state.componentStore.categories,
            category: state.componentStore.category,
            components: state.componentStore.components,
            activeSideKey: state.dragPage.activeSideKey,
        };
    },
})(function ComponentStore(props) {
    const {
        stores,
        store,
        // categories,
        category,
        components,
        // activeSideKey,
        action: {
            // dragPage: dragPageAction,
            componentStore: storeAction,
        },
    } = props;

    const [allComponents, setAllComponents] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const rootRef = useRef(null);
    const categoryRef = useRef(null);
    const componentRef = useRef(null);

    useEffect(() => {
        (async () => {
            const stores = await getStores();
            storeAction.setStores(stores);

            if (stores?.length) {
                await handleStoreChange(stores[0].value);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleComponentScroll = debounce(() => {
        const all = document.querySelectorAll('.componentCategory');
        for (const ele of Array.from(all)) {
            const {visible} = elementIsVisible(componentRef.current, ele);
            if (visible) {
                const subCategoryId = ele.getAttribute('data-subCategoryId');

                const element = document.getElementById(`subCategory_${subCategoryId}`);
                scrollElement(categoryRef.current, element);

                storeAction.setCategory(subCategoryId);
                return;
            }
        }
    }, 100);

    async function fetchComponents(category) {
        const components = await getComponents(category);
        storeAction.setComponents(components);
        setAllComponents(components);
    }

    async function handleStoreChange(value) {
        storeAction.setStore(value);
        setSearchValue('');
        if (categoryRef.current) categoryRef.current.scrollTop = 0;
        if (componentRef.current) componentRef.current.scrollTop = 0;
        handleComponentScroll();
        await fetchComponents(value);
    }

    const handleSearch = debounce((value) => {
        const result = filterTree(
            allComponents,
            node => {
                let {title = '', subTitle = '', config = {}} = node;
                let {componentName = ''} = config;

                title = title.toLowerCase();
                subTitle = subTitle.toLowerCase();
                componentName = componentName.toLowerCase();

                const val = value ? value.toLowerCase() : '';

                return title.includes(val)
                    || subTitle.includes(val)
                    || componentName.includes(val)
                    ;
            },
        );

        storeAction.setComponents(result);
    }, 100);

    return (
        <Pane
            header={
                <div>
                    <AppstoreOutlined style={{marginRight: 4}}/>
                    组件
                </div>
            }
        >
            <div className={styles.root} ref={rootRef}>
                <header>
                    <Input
                        allowClear
                        placeholder="请输入关键词搜索组件"
                        value={searchValue}
                        onChange={e => {
                            const {value} = e.target;

                            setSearchValue(value);
                            handleSearch(value);
                        }}
                    />
                    <Select
                        style={{width: '100%', marginTop: 4}}
                        placeholder="选择组件分类"
                        value={store}
                        onChange={handleStoreChange}
                        options={stores}
                    />
                </header>
                {!components?.length ? (
                    <main style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Empty description="暂无组件"/>
                    </main>
                ) : (
                    <main>
                        <div className={styles.category} ref={categoryRef}>
                            {components.map(baseCategory => {
                                const {id: baseCategoryId, title, children = [], hiddenInStore} = baseCategory;
                                if (hiddenInStore) return null;

                                return (
                                    <div key={baseCategoryId} id={`baseCategory_${baseCategoryId}`}>
                                        <div className={styles.baseCategory}>{title}</div>
                                        {children.map(item => {
                                            const {id: subCategoryId, hiddenInStore, children = []} = item;
                                            if (hiddenInStore) return null;
                                            const isActive = subCategoryId === category;

                                            const data = children[0];

                                            const handleCategoryClick = () => {
                                                const element = document.getElementById(`componentCategory_${subCategoryId}`);
                                                scrollElement(componentRef.current, element, true, true);

                                                // 等待组件滚动完，否则 三角标志会跳动
                                                // setTimeout(() => {
                                                storeAction.setCategory(subCategoryId);
                                                // }, 300);
                                            };

                                            return (
                                                <div
                                                    key={subCategoryId}
                                                    id={`subCategory_${subCategoryId}`}
                                                    className={[styles.subCategory, {[styles.active]: isActive}]}
                                                    onClick={() => handleCategoryClick()}
                                                >
                                                    <Draggable
                                                        data={data}
                                                        onDragEnd={() => setTimeout(handleCategoryClick)} // 等待组件面板显示出来
                                                    >
                                                        <div className={styles.title}>
                                                            {item.title}
                                                        </div>
                                                    </Draggable>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                        <div
                            className={styles.components}
                            id="storeComponents"
                            ref={componentRef}
                            onScroll={handleComponentScroll}
                        >
                            {components.map((baseCategory, index) => {
                                const {id: baseCategoryId, children: categories = [], hiddenInStore} = baseCategory;
                                const isBaseLast = index === components.length - 1;

                                if (hiddenInStore) return null;

                                return categories.map((category, i) => {
                                    const {id: subCategoryId, subTitle, children: nodes = [], hiddenInStore} = category;

                                    const isLast = isBaseLast && (i === categories.length - 1);

                                    if (hiddenInStore) return null;

                                    return (
                                        <div
                                            className="componentCategory"
                                            key={`${baseCategoryId}_${subCategoryId}`}
                                            data-subcategoryid={subCategoryId}
                                            style={{height: isLast ? '100%' : 'auto'}}
                                        >
                                            <div
                                                id={`componentCategory_${subCategoryId}`}
                                                className={styles.componentCategoryTitle}
                                            >
                                                {subTitle}
                                            </div>
                                            {nodes.map(item => {
                                                if (item.hiddenInStore) return null;

                                                return (
                                                    <div
                                                        key={`component_${item.id}`}
                                                        id={`component_${item.id}`}
                                                        onClick={() => {
                                                            const element = document.getElementById(`subCategory_${subCategoryId}`);
                                                            scrollElement(categoryRef.current, element);
                                                            storeAction.setCategory(subCategoryId);
                                                        }}
                                                    >
                                                        <ComponentItem key={item.id} data={item}/>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                });
                            })}
                        </div>
                    </main>
                )}
            </div>
        </Pane>
    );
});
