import { useState, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; 
import 'ag-grid-community/styles/ag-theme-alpine.css';
ModuleRegistry.registerModules([AllCommunityModule]);

const DataTable = ({ criteriaItems, setCriteriaItems, choiceItems, setChoiceItems }) => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);


  /********** CELL RENDERERS **********/ 
  const ImportanceCellRenderer = (props) => {
    const { value, data } = props;

    if (data.name === "TOTAL") return <span>{value}</span>;

    const updateCriterionAndRow = (newImportance) => {
      data.importance = newImportance;
      choiceItems.forEach((_, index) => {
        const choiceField = `choice${index + 1}`;
        const ratingField = `choice${index + 1}Rating`;
        const initialRating = data[choiceField];
        data[ratingField] = initialRating * newImportance;
      });

      const updatedCriteriaItems = criteriaItems.map(c =>
        c.name === data.name ? { ...c, sliderValue: newImportance } : c
      );
      setCriteriaItems(updatedCriteriaItems);
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
         <div>
          <span style={{ cursor: 'pointer' }} onClick={() => updateCriterionAndRow(value + 1)}>▲</span>
        </div>
        <span>{value}</span>
        <div>
          <span style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => { if (value > 1) updateCriterionAndRow(value - 1); }}>▼</span>
        </div>
      </div>
    );
  };


  const ChoiceCellRenderer = (props) => {
    const { value, data, colDef } = props;
    const field = colDef.field;

    if (data.name === "TOTAL") return <span>{value}</span>;

    const choiceIndexMatch = field.match(/choice(\d+)$/);
    if (!choiceIndexMatch) return <span>{value}</span>; // not a choice column

    const choiceIndex = parseInt(choiceIndexMatch[1], 10) - 1; // index in choiceItems
    const choiceName = choiceItems[choiceIndex]?.name;

    const updateChoiceValueAndRow = (newValue) => {
      data[field] = newValue;
      // Update corresponding rating field
      const ratingField = `${field}Rating`;
      data[ratingField] = newValue * data.importance;

      // Update choiceItems
      const updatedChoiceItems = choiceItems.map((c, idx) => {
        if (idx === choiceIndex) {
          return { ...c, initialRating: newValue }; // store the new value in choiceItems
        }
        return c;
      });
      setChoiceItems(updatedChoiceItems);
    };

    const handleIncrement = () => {
      if (value < 10) {
        updateChoiceValueAndRow(value + 1);
      }
    };

    const handleDecrement = () => {
      if (value > 1) {
        updateChoiceValueAndRow(value - 1);
      }
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
         <div>
          <span style={{ cursor: 'pointer' }} onClick={handleIncrement}>▲</span>
        </div>
        <span>{value}</span>
        <div>
          <span style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={handleDecrement}>▼</span>
        </div>
      </div>
    );
  };


  /******** useEffect FUNCTIONS **********/
  useEffect(() => {
    if (criteriaItems.length === 0) {
      setRowData([]);
      return;
    }

    const updatedColDefs = [
      { field: "name", headerName: "Criterion" },
      { field: "importance", headerName: "Importance", cellRenderer: ImportanceCellRenderer }
    ];

    choiceItems.forEach((choice, index) => {
      updatedColDefs.push({
        field: `choice${index + 1}`,
        headerName: `${choice.name}`,
        cellRenderer: ChoiceCellRenderer
      });
      updatedColDefs.push({
        field: `choice${index + 1}Rating`,
        headerName: "Rating"
      });
    });

    setColDefs(updatedColDefs);

    const rows = criteriaItems.map(criterion => {
      const criterionValue = criterion.sliderValue;
      const row = {
        name: criterion.name,
        importance: criterionValue
      };

      choiceItems.forEach((choice, index) => {
        const initialRating = choice.initialRating || 5; // default to 5 if not set
        row[`choice${index + 1}`] = initialRating;
        row[`choice${index + 1}Rating`] = initialRating * criterionValue;
      });

      return row;
    });

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


  /******** DISPLAY FUNCTIONS *********/
  const defaultColDef = { flex: 1 };
  const rowStyles = params => (params.data?.name === 'TOTAL' ? { fontWeight: 'bold', backgroundColor: '#f0f0f0' } : {});

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
