import { useState, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-alpine.css';
ModuleRegistry.registerModules([AllCommunityModule]);

// Moved outside component and uses context
const ImportanceCellRenderer = (props) => {
  const { value, data, context: { setCriteriaRows, criteriaRows } } = props;
  if (data.name === "TOTAL") return <span>{value}</span>;

  const updateImportance = (newValue) => {
    const updatedCriteriaRows = criteriaRows.map(c =>
      c.name === data.name ? { ...c, sliderValue: newValue } : c
    );
    setCriteriaRows(updatedCriteriaRows);
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
  const { value, data, colDef, context: { setCriteriaRows, criteriaRows } } = props;
  if (data.name === "TOTAL") return <span>{value}</span>;

  const choiceIndex = parseInt(colDef.field.replace('choice', ''), 10) - 1;

  const updateChoiceRating = (newValue) => {
    const updatedCriteriaRows = criteriaRows.map(criterion => {
      if (criterion.name === data.name) {
        const updatedChoices = criterion.choices.map((choice, index) => {
          if (index === choiceIndex) {
            return { ...choice, rating: newValue };
          }
          return choice;
        });
        return { ...criterion, choices: updatedChoices };
      }
      return criterion;
    });
    setCriteriaRows(updatedCriteriaRows);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ cursor: 'pointer' }} onClick={() => { if (value > 1) updateChoiceRating(value - 1); }}>▼</span>
      <span>{value}</span>
      <span style={{ cursor: 'pointer' }} onClick={() => { if (value < 10) updateChoiceRating(value + 1); }}>▲</span>
    </div>
  );
};

const DataTable = ({ criteriaRows, setCriteriaRows }) => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [pinnedBottomRowData, setPinnedBottomRowData] = useState([]);
  const [showResults, setShowResults] = useState(false);


  useEffect(() => {
    if (criteriaRows.length === 0) {
      setRowData([]);
      return;
    }

    const choiceCount = criteriaRows[0].choices.length;
    const updatedColDefs = [
      { field: "name", headerName: "Criterion" },
      { field: "importance", headerName: "Importance", cellRenderer: ImportanceCellRenderer }
    ];

    for (let i = 0; i < choiceCount; i++) {
      updatedColDefs.push({
        field: `choice${i + 1}`,
        headerName: criteriaRows[0].choices[i].name,
        cellRenderer: ChoiceCellRenderer
      });
      updatedColDefs.push({
        field: `choice${i + 1}Rating`,
        headerName: "Rating"
      });
    }

    setColDefs(updatedColDefs);

    const rows = criteriaRows.map(criterion => {
      const row = {
        name: criterion.name,
        importance: criterion.sliderValue
      };

      criterion.choices.forEach((choice, index) => {
        row[`choice${index + 1}`] = choice.rating;
        row[`choice${index + 1}Rating`] = choice.rating * criterion.sliderValue;
      });

      return row;
    });

    const firstCriterion = criteriaRows[0];
    let totalImportance = 0;
    const totalRatings = {};
    rows.forEach(row => {
      totalImportance += Number(row.importance) || 0;
      firstCriterion.choices.forEach((_, index) => {
        const key = `choice${index + 1}Rating`;
        totalRatings[key] = (totalRatings[key] || 0) + (Number(row[key]) || 0);
      });
    });

    const totalsRow = { name: "TOTAL", importance: totalImportance };
    firstCriterion.choices.forEach((_, index) => {
      const ratingKey = `choice${index + 1}Rating`;
      totalsRow[`choice${index + 1}`] = "";
      totalsRow[ratingKey] = showResults ? totalRatings[ratingKey] : "0";
    });
    setRowData(rows);
    setPinnedBottomRowData([totalsRow]);
  }, [criteriaRows]);

  const defaultColDef = { flex: 1 };
  const rowStyles = params => (params.data?.name === 'TOTAL' ? { fontWeight: 'bold', backgroundColor: '#f0f0f0' } : {});

  return (
    <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        getRowStyle={rowStyles}
        context={{ criteriaRows, setCriteriaRows }}
        pinnedBottomRowData={pinnedBottomRowData}
      />
    </div>
  );
};

export default DataTable;
