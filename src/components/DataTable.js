import { useState, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; 
import 'ag-grid-community/styles/ag-theme-alpine.css';
ModuleRegistry.registerModules([AllCommunityModule]);

const DataTable = ({ criteriaItems, setCriteriaItems, choiceItems }) => {

  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);

  /******** CELL RENDERER ********/
  const ImportanceCellRenderer = (props) => {
    const { value, data, api } = props;

    if (data.name === "TOTAL") {
      return <span>{value}</span>;
    }

    const updateCriterionAndRow = (newImportance) => {
      // Update rowData in table
      data.importance = newImportance;
      choiceItems.forEach((_, index) => {
        const choiceField = `choice${index + 1}`;
        const ratingField = `choice${index + 1}Rating`;
        const initialRating = data[choiceField];
        data[ratingField] = initialRating * newImportance;
      });
      api.applyTransaction({ update: [data] });

      // Update criteriaItems to persist changes
      const updatedCriteriaItems = criteriaItems.map(c => {
        if (c.name === data.name) {
          return { ...c, sliderValue: newImportance };
        }
        return c;
      });
      setCriteriaItems(updatedCriteriaItems);
    };

    const handleIncrement = () => {
      updateCriterionAndRow(value + 1);
    };

    const handleDecrement = () => {
      if (value > 1) {
        updateCriterionAndRow(value - 1);
      }
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{value}</span>
        <div>
          <span style={{ cursor: 'pointer' }} onClick={handleIncrement}>▲</span>
          <span style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={handleDecrement}>▼</span>
        </div>
      </div>
    );
  };

  /******** COLUMNS & ROWS ********/
  useEffect(() => {
    if (criteriaItems.length === 0) {
      setRowData([]);
      return;
    }

    // Columns
    const updatedColDefs = [
      { field: "name", headerName: "Criterion" },
      {
        field: "importance",
        headerName: "Importance",
        cellRenderer: ImportanceCellRenderer
      }
    ];

    choiceItems.forEach((choice, index) => {
      updatedColDefs.push({
        field: `choice${index + 1}`,
        headerName: `${choice.name}`
      });
      updatedColDefs.push({
        field: `choice${index + 1}Rating`,
        headerName: "Rating"
      });
    });

    setColDefs(updatedColDefs);

    // Rows
    const rows = criteriaItems.map(criterion => {
      const criterionValue = criterion.sliderValue;
      const row = {
        name: criterion.name,
        importance: criterionValue
      };

      choiceItems.forEach((choice, index) => {
        const initialRating = 5;
        row[`choice${index + 1}`] = initialRating;
        row[`choice${index + 1}Rating`] = initialRating * criterionValue;
      });

      return row;
    });

    // Totals row
    let totalImportance = 0;
    const totalRatings = {};
    rows.forEach(row => {
      totalImportance += Number(row.importance) || 0;
      choiceItems.forEach((_, index) => {
        const key = `choice${index + 1}Rating`;
        totalRatings[key] = (totalRatings[key] || 0) + (Number(row[key]) || 0);
      });
    });

    const totalsRow = { name: "TOTAL", importance: totalImportance };
    choiceItems.forEach((_, index) => {
      const ratingKey = `choice${index + 1}Rating`;
      totalsRow[`choice${index + 1}`] = "";
      totalsRow[ratingKey] = totalRatings[ratingKey];
    });
    rows.push(totalsRow);

    setRowData(rows);

  }, [criteriaItems, choiceItems]);

  const defaultColDef = { flex: 1 };
  const rowStyles = params => {
    if (params.data?.name === 'TOTAL') {
      return { fontWeight: 'bold', backgroundColor: '#f0f0f0' };
    }
    return {};
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        getRowStyle={rowStyles}
      />
    </div>
  );
};

export default DataTable;
