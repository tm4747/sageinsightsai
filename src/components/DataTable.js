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
    const updatedDecisionFactors = decisionFactors.map(decFactor =>
      decFactor.name === data.name ? { ...decFactor, rating: newValue } : decFactor
    );
    setDecisionFactors(updatedDecisionFactors);
  };
  const updateable = currentStep === 4;
  const activeStyle = updateable ? "flash-green" : "";

  return (
    <div className={activeStyle}  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      <span style={{ cursor: 'pointer' }} onClick={() => { if (updateable && value < 10 ) updateImportance(updateable && value + 1); }}>▲</span>
      <span className={updateable ? "bold" : ""}>{value}</span>
      <span style={{ cursor: 'pointer' }} onClick={() => { if (updateable && value > 1) updateImportance(updateable && value - 1); }}>▼</span>
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

  const updateable = currentStep === 5;
  const activeStyle = updateable ? "flash-green" : "";

  return (
    <div className={activeStyle}  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      { showOptionsRatings ? <>
        <span style={{ cursor: 'pointer' }} onClick={() => { if (updateable && value < 10) updateChoiceRating(updateable && value + 1); }}>▲</span>
        <span className={updateable ? "bold" : ""}>{value}</span>
        <span style={{ cursor: 'pointer' }} onClick={() => { if (updateable && value > 1) updateChoiceRating(updateable && value - 1); }}>▼</span>
      </> : ""}
    </div>
  );
};

/*** CONTROLS DISPLAY OF WEIGHTED POTENTIAL OPTION SCORE - this value is calculated as the product of DECISION FACTOR IMPORTANCE and POTENTIAL OPTION RATING ***/
const ChoiceRatingCellRenderer = (props) => {
  const { value, data, colDef, context: { currentStep, maxScoreKey, minScoreKey } } = props;
  const showOptionsRatings = currentStep >= 6;
  const isTotalRow = data.name === "TOTAL";
  const field = colDef.field;

  let cellStyle = "";
  if (isTotalRow && currentStep === 6) {
    if (field === maxScoreKey) {
      cellStyle = "flash-green"; // light green
    } else if (field === minScoreKey) {
      cellStyle = "flash-red"; // light red
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className={cellStyle}>
      { showOptionsRatings && <span className={currentStep === 6 ? "bold" : ""}>{value}</span> }
    </div>
  );
};



const DataTable = ({ decisionFactors, potentialOptions, setDecisionFactors, setPotentialOptions, currentStep }) => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [pinnedBottomRowData, setPinnedBottomRowData] = useState([]);
  const [maxScoreKey, setMaxScoreKey] = useState(null);
  const [minScoreKey, setMinScoreKey] = useState(null);

  /*** UPDATE TABLE DATA */
  useEffect(() => {
    if (decisionFactors.length === 0) {
      setRowData([]);
      return;
    }

    /** SET / UPDATE COLDEFS */
    const choiceCount = potentialOptions.length;
    const updatedColDefs = [
      { 
        field: "name", 
        tooltipField: "name",
        headerName: "Decision Factors",
        headerTooltip: "Decision Factors",
      },
      { 
        field: "importance", 
        headerName: "Importance", 
        cellRenderer: ImportanceCellRenderer 
      }
    ];
    for (let i = 0; i < choiceCount; i++) {
      updatedColDefs.push({
        field: `choice${i + 1}`,
        headerName: potentialOptions[i].name,
        headerTooltip: potentialOptions[i].name,
        cellRenderer: ChoiceCellRenderer
      });
      updatedColDefs.push({
        field: `choice${i + 1}Rating`,
        headerName: "Score",
        cellRenderer: ChoiceRatingCellRenderer,
        maxWidth: 65, // realistic minimum
        suppressSizeToFit: true,
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
    let maxScore = -Infinity;
    let minScore = Infinity;
    let maxKey = null;
    let minKey = null;
    const totalRatings = {};

    rows.forEach(row => {
      totalImportance += Number(row.importance) || 0;
      potentialOptions.forEach((_, index) => {
        const key = `choice${index + 1}Rating`;
        totalRatings[key] = (totalRatings[key] || 0) + (Number(row[key]) || 0);
      });
    });

    // calculate max and min
    Object.entries(totalRatings).forEach(([key, value]) => {
      if (value > maxScore) {
        maxScore = value;
        maxKey = key;
      }
      if (value < minScore) {
        minScore = value;
        minKey = key;
      }
    });

    setMaxScoreKey(maxKey);
    setMinScoreKey(minKey);

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
          tooltipShowDelay={500}
          tooltipShowMode={"whenTruncated"}
          context={{ 
            setDecisionFactors, 
            decisionFactors, 
            setPotentialOptions, 
            potentialOptions, 
            currentStep,
            maxScoreKey,
            minScoreKey,
          }}
          style={{width: 1400, border: "solid 2px green", overflow: "scroll"}}
          domLayout="autoHeight"
          pinnedBottomRowData={pinnedBottomRowData}
        />
      </div>
    </div>
  );
};

export default DataTable;
