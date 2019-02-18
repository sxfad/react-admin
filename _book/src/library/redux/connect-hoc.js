const createConnectHOC = connect => (mapStateToProps = state => ({})) => (WrappedComponent) => connect({mapStateToProps, LayoutComponent: WrappedComponent});
export default createConnectHOC;
