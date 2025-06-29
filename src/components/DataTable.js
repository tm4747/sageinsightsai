import { useState, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-alpine.css';
ModuleRegistry.registerModules([AllCommunityModule]);

// Moved outside component and uses context
const ImportanceCellRenderer = (props) => {
  const { value, data, context: { criteria, setCriteria } } = props;
  if (data.name === "TOTAL") return <span>{value}</span>;

  const updateImportance = (newValue) => {
    const updatedCriteria = criteria.map(c =>
      c.name === data.name ? { ...c, sliderValue: newValue } : c
    );
    setCriteria(updatedCriteria);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ cursor: 'pointer' }} onClick={() => { if (value > 1) updateImportance(value - 1); }}>▼</span>
      <span>{value}</span>
      <span style={{ cursor: 'pointer' }} onClick={() => updateImportance(value + 1)}>▲</span>
    </div>
  );
};

const ChoiceCellRenderer = (props) => {
  const { value, data, colDef, context: { criteria, setChoices, choices } } = props;
  if (data.name === "TOTAL") return <span>{value}</span>;

  const choiceIndex = parseInt(colDef.field.replace('choice', ''), 10) - 1;

  const updateChoiceRating = (newValue) => {
    criteria.map((criterion, criterionIndex) => {
      if (criterion.name === data.name) {
        const updatedChoices = choices.map((choice, index) => {
          if (index === choiceIndex) {
            const updatedRatings = [...choice.ratings]; 
            updatedRatings[criterionIndex] = newValue; 
            return { ...choice, ratings: updatedRatings };
          }
          return choice;
        });
        setChoices(updatedChoices);
      }
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ cursor: 'pointer' }} onClick={() => { if (value > 1) updateChoiceRating(value - 1); }}>▼</span>
      <span>{value}</span>
      <span style={{ cursor: 'pointer' }} onClick={() => { if (value < 10) updateChoiceRating(value + 1); }}>▲</span>
    </div>
  );
};


const DataTable = ({ criteria, choices, setCriteria, setChoices, showResults }) => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [criteriaRows, setCriteriaRows] = useState([]);
  const [pinnedBottomRowData, setPinnedBottomRowData] = useState([]);

  /*** UPDATE TABLE DATA */
  useEffect(() => {
    if (criteria.length === 0) {
      setRowData([]);
      return;
    }

    const choiceCount = choices.length;
    const updatedColDefs = [
      { field: "name", headerName: "Criterion" },
      { field: "importance", headerName: "Importance", cellRenderer: ImportanceCellRenderer }
    ];

    for (let i = 0; i < choiceCount; i++) {
      updatedColDefs.push({
        field: `choice${i + 1}`,
        headerName: choices[i].name,
        cellRenderer: ChoiceCellRenderer
      });
      updatedColDefs.push({
        field: `choice${i + 1}Rating`,
        headerName: "Rating"
      });
    }

    setColDefs(updatedColDefs);

    const rows = criteria.map(( criterion, criterionIndex) => {
      const row = {
        name: criterion.name,
        importance: criterion.sliderValue
      };

      choices.forEach((choice, index) => {
        row[`choice${index + 1}`] = choice.ratings[criterionIndex];
        row[`choice${index + 1}Rating`] = choice.ratings[criterionIndex] * criterion.sliderValue;
      });

      return row;
    });

    const firstCriterion = criteria[0];
    let totalImportance = 0;
    const totalRatings = {};
    rows.forEach(row => {
      totalImportance += Number(row.importance) || 0;
      choices.forEach((_, index) => {
        const key = `choice${index + 1}Rating`;
        totalRatings[key] = (totalRatings[key] || 0) + (Number(row[key]) || 0);
      });
    });

    const totalsRow = { name: "TOTAL", importance: totalImportance };
    choices.forEach((_, index) => {
      const ratingKey = `choice${index + 1}Rating`;
      totalsRow[`choice${index + 1}`] = "";
      totalsRow[ratingKey] = showResults ? totalRatings[ratingKey] : null;
    });
    setRowData(rows);
    setPinnedBottomRowData([totalsRow]);
    console.log("criteria", criteria);
    console.log("choices", choices);
    console.log("rowData", rowData);
  }, [criteria, choices, showResults]);


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
          context={{ setCriteria, criteria, setChoices, choices}}
          pinnedBottomRowData={pinnedBottomRowData}
        />
      </div>
    </div>
  );





};

export default DataTable;
