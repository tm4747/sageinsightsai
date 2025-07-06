import { useState, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-alpine.css';
ModuleRegistry.registerModules([AllCommunityModule]);

// Moved outside component and uses context
const ImportanceCellRenderer = (props) => {
  const { value, data, context: { whatMatters, setWhatMatters } } = props;
  if (data.name === "TOTAL") return <span>{value}</span>;

  const updateImportance = (newValue) => {
    const updatedWhatMatters = whatMatters.map(c =>
      c.name === data.name ? { ...c, rating: newValue } : c
    );
    setWhatMatters(updatedWhatMatters);
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
  const { value, data, colDef, context: { whatMatters, setPotentialOptions, potentialOptions } } = props;
  if (data.name === "TOTAL") return <span>{value}</span>;

  const choiceIndex = parseInt(colDef.field.replace('choice', ''), 10) - 1;

  const updateChoiceRating = (newValue) => {
    whatMatters.map((whatMattersItem, whatMattersItemIndex) => {
      if (whatMattersItem.name === data.name) {
        const updatedPotentialOptions = potentialOptions.map((choice, index) => {
          if (index === choiceIndex) {
            const updatedRatings = [...choice.ratings]; 
            updatedRatings[whatMattersItemIndex] = newValue; 
            return { ...choice, ratings: updatedRatings };
          }
          return choice;
        });
        setPotentialOptions(updatedPotentialOptions);
      }
      return null;
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


const DataTable = ({ whatMatters, potentialOptions, setWhatMatters, setPotentialOptions, showResults }) => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [pinnedBottomRowData, setPinnedBottomRowData] = useState([]);

  /*** UPDATE TABLE DATA */
  useEffect(() => {
    if (whatMatters.length === 0) {
      setRowData([]);
      return;
    }

    const choiceCount = potentialOptions.length;
    const updatedColDefs = [
      { field: "name", headerName: "What Matters" },
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
        headerName: "Rating"
      });
    }

    setColDefs(updatedColDefs);

    const rows = whatMatters.map(( whatMattersItem, whatMattersItemIndex) => {
      const row = {
        name: whatMattersItem.name,
        importance: whatMattersItem.rating
      };

      potentialOptions.forEach((choice, index) => {
        row[`choice${index + 1}`] = choice.ratings[whatMattersItemIndex];
        row[`choice${index + 1}Rating`] = choice.ratings[whatMattersItemIndex] * whatMattersItem.rating;
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

    const totalsRow = { name: "TOTAL", importance: totalImportance };
    potentialOptions.forEach((_, index) => {
      const ratingKey = `choice${index + 1}Rating`;
      totalsRow[`choice${index + 1}`] = "";
      totalsRow[ratingKey] = showResults ? totalRatings[ratingKey] : null;
    });
    setRowData(rows);
    setPinnedBottomRowData([totalsRow]);
    console.log("whatMatters", whatMatters);
    console.log("potentialOptions", potentialOptions);
  }, [whatMatters, potentialOptions, showResults]);


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
          context={{ setWhatMatters, whatMatters, setPotentialOptions, potentialOptions}}
          pinnedBottomRowData={pinnedBottomRowData}
        />
      </div>
    </div>
  );





};

export default DataTable;
