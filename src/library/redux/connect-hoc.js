export default connect => (mapStateToProps = state => ({})) => (WrappedComponent) => connect({mapStateToProps, LayoutComponent: WrappedComponent});
