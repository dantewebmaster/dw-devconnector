const getMenu = async (country, businessModelId) => {
  try {
    const countryMenu = await import(`./${country}-${businessModelId}.js`);
    // eslint-disable-next-line no-console
    console.log(countryMenu.default);
    return countryMenu.default;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Get Menu', error);
  }
}

export default getMenu;
