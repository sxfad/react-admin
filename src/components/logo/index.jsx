import logo from './logo.png';
import { APP_NAME } from 'src/config';
import styles from './style.less';

export default function Logo(props) {
    if (props.image) return logo;

    return (
        <div className={styles.root}>
            <img src={logo} alt="logo" />
            <h1>{APP_NAME}</h1>
        </div>
    );
}
