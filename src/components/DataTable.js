import { useState, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import "./styles/DataTable.css"
import 'ag-grid-community/styles/ag-theme-alpine.css';
ModuleRegistry.registerModules([AllCommunityModule]);

/*** RENDERS ADJUSTABLE DECISION FACTOR IMPORTANCE ***/
const ImportanceCellRenderer = (props) => {
  const { value, data, context: { decisionFactors, setDecisionFactors, currentStep } } = props;
  if (data.name === "TOTAL") return <span>{value}</span>;

  const updateImportance = (newValue) => {
    const updatedDecisionFactors = decisionFactors.map(c =>
      c.name === data.name ? { ...c, rating: newValue } : c
    );
    setDecisionFactors(updatedDecisionFactors);
  };
  const activeStyle = currentStep === 4 ? "flash-green" : "";

  return (
    <div className={activeStyle}  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      <span style={{ cursor: 'pointer' }} onClick={() => { if (value > 1) updateImportance(value - 1); }}>▼</span>
      <span className={currentStep === 4 ? "bold" : ""}>{value}</span>
      <span style={{ cursor: 'pointer' }} onClick={() => { if (value < 10 ) updateImportance(value + 1); }}>▲</span>
    </div>
  );
};

/*** RENDERS THE VALUE AND ADJUSTS VALUE OF POTENTIAL OPTIONS RATINGS ***/
const ChoiceCellRenderer = (props) => {
  const { value, data, colDef, context: { decisionFactors, setPotentialOptions, potentialOptions, currentStep } } = props;
  const showOptionsRatings = currentStep >= 5;
  if (data.name === "TOTAL") return <span>{value}</span>;

  const choiceIndex = parseInt(colDef.field.replace('choice', ''), 10) - 1;

  const updateChoiceRating = (newValue) => {
    decisionFactors.map((decisionFactorsItem, decisionFactorsItemIndex) => {
      if (decisionFactorsItem.name === data.name) {
        const updatedPotentialOptions = potentialOptions.map((choice, index) => {
          if (index === choiceIndex) {
            const updatedRatings = [...choice.ratings]; 
            updatedRatings[decisionFactorsItemIndex] = newValue; 
            return { ...choice, ratings: updatedRatings };
          }
          return choice;
        });
        setPotentialOptions(updatedPotentialOptions);
      }
      return null;
    });
  };

  const activeStyle = currentStep === 5 ? "flash-green" : "";

  return (
    <div className={activeStyle}  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      { showOptionsRatings ? <>
        <span style={{ cursor: 'pointer' }} onClick={() => { if (value > 1) updateChoiceRating(value - 1); }}>▼</span>
        <span className={currentStep === 5 ? "bold" : ""}>{value}</span>
        <span style={{ cursor: 'pointer' }} onClick={() => { if (value < 10) updateChoiceRating(value + 1); }}>▲</span>
      </> : ""}
    </div>
  );
};

/*** CONTROLS DISPLAY OF WEIGHTED POTENTIAL OPTION SCORE - this value is calculated as the product of DECISION FACTOR IMPORTANCE and POTENTIAL OPTION RATING ***/
const ChoiceRatingCellRenderer = (props) => {
  const { value, context: { currentStep } } = props;
  const showOptionsRatings = currentStep >= 6;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      { showOptionsRatings ? <>
        <span className={currentStep === 6 ? "bold" : ""}>{value}</span>
      </> : ""}
    </div>
  );
};


const DataTable = ({ decisionFactors, potentialOptions, setDecisionFactors, setPotentialOptions, currentStep }) => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [pinnedBottomRowData, setPinnedBottomRowData] = useState([]);

  /*** UPDATE TABLE DATA */
  useEffect(() => {
    if (decisionFactors.length === 0) {
      setRowData([]);
      return;
    }

    /** SET / UPDATE COLDEFS */
    const choiceCount = potentialOptions.length;
    const updatedColDefs = [
      { field: "name", headerName: "Decision Factors" },
      { field: "importance", headerName: "Importance", cellRenderer: ImportanceCellRenderer }
    ];
    for (let i = 0; i < choiceCount; i++) {
      updatedColDefs.push({
        field: `choice${i + 1}`,
        headerName: potentialOptions[i].name,
        cellRenderer: ChoiceCellRenderer
      });
      updatedColDefs.push({
        field: `choice${i + 1}Rating`,
        headerName: "Score",
        cellRenderer: ChoiceRatingCellRenderer
      });
    }
    setColDefs(updatedColDefs);


    const rows = decisionFactors.map(( decisionFactorsItem, decisionFactorsItemIndex) => {
      const row = {
        name: decisionFactorsItem.name,
        importance: decisionFactorsItem.rating
      };

      potentialOptions.forEach((choice, index) => {
        row[`choice${index + 1}`] = choice.ratings[decisionFactorsItemIndex];
        row[`choice${index + 1}Rating`] = choice.ratings[decisionFactorsItemIndex] * decisionFactorsItem.rating;
      });

      return row;
    });

    let totalImportance = 0;
    const totalRatings = {};
    rows.forEach(row => {
      totalImportance += Number(row.importance) || 0;
      potentialOptions.forEach((_, index) => {
        const key = `choice${index + 1}Rating`;
        totalRatings[key] = (totalRatings[key] || 0) + (Number(row[key]) || 0);
      });
    });

    // RENDER TOTAL ROW? 
    const totalsRow = { name: "TOTAL", importance: totalImportance };
    potentialOptions.forEach((_, index) => {
      const ratingKey = `choice${index + 1}Rating`;
      totalsRow[`choice${index + 1}`] = "";
      totalsRow[ratingKey] = currentStep === 6 ? totalRatings[ratingKey] : null;
    });
    setRowData(rows);
    setPinnedBottomRowData([totalsRow]);
  }, [decisionFactors, potentialOptions, currentStep]);


  const defaultColDef = { flex: 1 };
  const rowStyles = params => (params.data?.name === 'TOTAL' ? { fontWeight: 'bold', backgroundColor: '#f0f0f0' } : {});

  return (
    <div className="table-scroll-container">
      <div className="ag-theme-alpine responsive-grid">
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          getRowStyle={rowStyles}
          context={{ setDecisionFactors, decisionFactors, setPotentialOptions, potentialOptions, currentStep}}
          pinnedBottomRowData={pinnedBottomRowData}
        />
      </div>
    </div>
  );





};

export default DataTable;
