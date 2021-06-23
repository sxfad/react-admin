import {
    replaceNode,
    findNodeById,
    findParentNodeById,
    findParentNodes,
    findNodeFieldPaths,
    findParentNodeByName,
    findNodesByName,
    deleteNodeById,
    findNodeCollection,
    insertBefore,
} from './node-util';
import {cloneDeep} from 'lodash';
import {describe, test} from '@jest/globals';

const node = {
    id: '1',
    componentName: 'div',
    props: {
        icon: {
            id: '2',
            componentName: 'Icon',
            props: {
                color: 'red',
                render: {
                    id: '3',
                    componentName: 'IconRender',
                },
            },
            children: [
                {
                    id: '4',
                    componentName: 'Text',
                    props: {
                        text: '图标',
                    },
                },
            ],
        },
        actions: [
            {
                id: '5',
                componentName: 'Button',
                children: [
                    {
                        id: '6',
                        componentName: 'Text',
                        props: {
                            text: '添加',
                        },
                    },
                ],
            },
            {
                id: '7',
                componentName: 'Button',
                children: [
                    {
                        id: '8',
                        componentName: 'Text',
                        props: {
                            text: '删除',
                        },
                    },
                ],
            },
        ],
        render: {
            renderField: {
                id: '9',
                componentName: 'Div',
            },
            renderFields: [
                {
                    id: '10',
                    componentName: 'Div',
                    children: [
                        {
                            id: '11',
                            componentName: 'Text',
                            props: {
                                text: '文本',
                            },
                        },
                    ],
                },
            ],
        },
    },
    children: [
        {
            id: '12',
            componentName: 'Text',
            children: [
                {
                    id: '8264aa83-e1fd-4bcc-9f41-642cddb2e5ff',
                    componentName: 'div',
                },
                {
                    id: '13',
                    componentName: 'Text',
                },
                {
                    id: '14',
                    componentName: 'Text14',
                    children: [
                        {
                            id: '15',
                            componentName: 'Text15',
                            children: [
                                {
                                    id: '16',
                                    componentName: 'div',
                                },
                            ],
                        },
                        {
                            id: '17',
                            componentName: 'Text17',
                            children: [
                                {
                                    id: '18',
                                    componentName: 'div',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

(() => {

    describe('insertBefore', () => {
        test('insertBefore', () => {
            const root = cloneDeep(node);
            const sourceNode = findNodeById(root, '15');

            insertBefore(root, sourceNode, '4');

            const result = findNodeCollection(root, '4');
            expect(result?.length).toBe(2);
        });
    });


    describe('findNodeCollection', () => {
        test('findNodeCollection', () => {
            const result = findNodeCollection(node, '4');
            expect(result?.length).toBe(1);
        });

        test('findNodeCollection', () => {
            const result = findNodeCollection(node, '2');
            expect(result?.length).toBe(undefined);
        });

    });

    describe('replaceNode', () => {
        test('replaceNode icon', () => {
            const root = cloneDeep(node);
            const targetNode = findNodeById(root, '2');
            const sourceNode = {
                id: '99',
                componentName: 'Icon99',
            };

            replaceNode(root, sourceNode, targetNode);
            const paths = findNodeFieldPaths(root, '99');
            expect(paths.join(',')).toBe('$,props,icon');
        });
        test('replaceNode icon from root', () => {
            const root = cloneDeep(node);
            const targetNode = findNodeById(root, '2');
            const sourceNode = findNodeById(root, '15');

            replaceNode(root, sourceNode, targetNode);

            const paths = findNodeFieldPaths(root, '15');
            expect(paths.join(',')).toBe('$,props,icon');

            const sNode = findNodeById(root, '2');

            expect(sNode).toBe(undefined);

        });
    });

    describe('deleteNodeById', () => {
        test('deleteNodeById1', () => {
            const myNode = cloneDeep(node);

            const result = deleteNodeById(myNode, '15');

            expect(result.id).toBe('15');

            const r = findNodeById(myNode, '15');
            expect(r).toBe(undefined);
        });
        test('deleteNodeById2', () => {
            const myNode = cloneDeep(node);

            const result = deleteNodeById(myNode, '2');

            expect(result.id).toBe('2');

            const r = findNodeById(myNode, '2');
            expect(r).toBe(undefined);
        });
        test('deleteNodeById3', () => {
            const myNode = cloneDeep(node);

            const result = deleteNodeById(myNode, '2222');

            expect(result).toBe(null);

            const r = findNodeById(myNode, '2222');
            expect(r).toBe(undefined);
        });
    });

    describe('findNodesByName', () => {
        test('findNodesByName', () => {
            const result = findNodesByName(node, 'Text15');

            expect(result[0].id).toBe('15');
        });
    });

    describe('findParentNodeByName', () => {
        test('findParentNodeByName', () => {
            const result = findParentNodeByName(node, 'Text', '15');

            expect(result.id).toBe('12');

        });
    });

    describe('findParentNodes', () => {
        test('findParentNodes', () => {
            const result = findParentNodes(node, '15');

            expect(result?.map(item => item.id).join(',')).toBe('1,12,14');

        });
    });


    describe('findParentNodeById', () => {
        test('findParentNodeById', () => {
            const result = findParentNodeById(node, '12');

            expect(result?.id).toBe('1');
        });
        test('findParentNode2', () => {
            const result = findParentNodeById(node, '11');

            expect(result?.id).toBe('10');
        });
        test('findParentNode3', () => {
            const result = findParentNodeById(node, '2');

            expect(result?.id).toBe(undefined);
        });
    });

    describe('findNodeFieldPaths', () => {
        test('findNodeFieldPaths', () => {
            const paths = findNodeFieldPaths(node, '9');

            expect(paths).toMatchObject(['$', 'props', 'render', 'renderField']);
        });test('findNodeFieldPaths', () => {
            const paths = findNodeFieldPaths(node, '8264aa83-e1fd-4bcc-9f41-642cddb2e5ff');
            console.log(paths);

        });
    });

    describe('findNodeById', () => {
        test('可以找到', () => {
            const id = '10';
            const result = findNodeById(node, id);
            expect(result?.id).toBe(id);
        });

        test('找不到', () => {
            const id = '101';
            const result = findNodeById(node, id);
            expect(result).toBe(undefined);
        });
    });
})();


