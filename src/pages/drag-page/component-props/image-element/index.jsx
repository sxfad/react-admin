import React from 'react';
import {Upload, Button} from 'antd';
import {UploadOutlined, CloseCircleFilled} from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './style.less';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const ArrayElement = props => {
    const {
        value,
        onChange,
        allowClear = true,
        placeholder = '点击上传',
    } = props;

    async function handleChange(info) {
        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        // if (info.file.status === 'done') {
        //     message.success(`${info.file.name} file uploaded successfully`);
        // } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} file upload failed.`);
        // }
        const {file} = info;
        const base64 = await getBase64(file);
        onChange(base64);
    }

    return (
        <Upload
            className={styles.root}
            name="image"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleChange}
        >
            <Button icon={<UploadOutlined/>}>{placeholder}</Button>
            {value && allowClear ? (
                <CloseCircleFilled
                    className={styles.close}
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange(undefined);
                    }}
                />
            ) : null}
        </Upload>
    );
};

ArrayElement.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    allowClear: PropTypes.bool,
    placeholder: PropTypes.array,
};

export default ArrayElement;
