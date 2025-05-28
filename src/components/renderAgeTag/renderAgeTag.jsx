import { Tag } from 'antd';

const renderAgeTag = (ageRating) => {
    switch (ageRating) {
        case 'P':
            return <Tag color="#87d068">P - Mọi lứa tuổi</Tag>;
        case 'T13':
            return <Tag color="#108ee9">T13 - Trên 13+</Tag>;
        case 'T16':
            return <Tag color="#2db7f5">T16 - Trên 16+</Tag>;
        case 'T18':
            return <Tag color="#f50">T18 - Trên 18+</Tag>;
        default:
            return <Tag>{ageRating}</Tag>;
    }
};

export default renderAgeTag;