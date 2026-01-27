// src/pages/NurseDispensingPage.jsx

import React from 'react';
import DispenseForm from '../components/DispenseForm';

const NurseDispensingPage = () => {
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Nurse Dispensing Interface</h1>
            <DispenseForm />
        </div>
    );
};

export default NurseDispensingPage;