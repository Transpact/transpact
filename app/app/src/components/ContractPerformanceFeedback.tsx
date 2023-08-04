import React from 'react';
import { Rate } from 'antd';

interface ContractPerformanceFeedbackProps {
  contractorRating: number;
  onRatingChange: (rating: number) => void;
}

const ContractPerformanceFeedback: React.FC<ContractPerformanceFeedbackProps> = ({ contractorRating, onRatingChange }) => {
  return (
    <div>
      <h3>Contractor Performance Rating</h3>
      <Rate allowHalf value={contractorRating} onChange={onRatingChange} />
    </div>
  );
};

export default ContractPerformanceFeedback;
