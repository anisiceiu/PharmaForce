export function getAverage(list: number[]) {
  return list.reduce((memo, num) => memo + num, 0) / list.length || 1;
}

export function groupBy(collection: any[], property: string) {
  var i = 0, val, index,
    values = [], result = [];
  for (; i < collection.length; i++) {
    val = collection[i][property];
    index = values.indexOf(val);
    if (index > -1)
      result[index].push(collection[i]);
    else {
      values.push(val);
      result.push([collection[i]]);
    }
  }
  return result;
}
export function toPascalCase(columnName: string): string {
        // Special cases mapping
    const specialCases: { [key: string]: string } = {
        'specialty_full_time_equivalents_ftes': 'Specialty Full Time Equivalents FTEs',
        'primary_care_full_time_equivalents_ftes': 'Primary Care Full Time Equivalents FTEs',
        'name_of_a_cso_contract_sales_organization': 'Name Of A CSO Contract Sales Organization',
        // Add more special cases here as needed
    };

    // Return the special case if it exists
    if (specialCases[columnName]) {
        return specialCases[columnName];
    }

    // Default conversion for other column names
    return columnName
        .split('_')  // Split by underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize each word
        .join(' ');  // Join words with a space
}
