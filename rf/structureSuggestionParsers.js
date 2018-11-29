const parseGeoStructureTree = payload => {
  const lastLevels = payload.filter(item => item.nextLevel.length === 0);

  const parsedGeoStructure = lastLevels.map(item => {
    let label = '';
    item.parentTree.reverse().map(parent => label = label + `${parent.geoStructureDescription} / `);
    return {
      geoCoverageCode: item.geoCoverageCode,
      geoStructureDescription: `${label + item.geoCoverageCode} - ${item.geoStructureDescription}`,
    };
  });

  return { parsedGeoStructure };
};

export {
  parseGeoStructureTree,
};
