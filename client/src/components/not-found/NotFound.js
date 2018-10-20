import React from 'react';
import PageTemplate from '../layout/PageTemplate/PageTemplate';
import Typography from '@material-ui/core/Typography';

export default () => {
  return (
    <PageTemplate pageTitle="404: Not Found" headerImage={'https://source.unsplash.com/1380x380/?code'}>
      <Typography variant="h2" component="h1" gutterBottom>Page not found</Typography>
      <Typography variant="subtitle1" gutterBottom>The content you are looking for does not exists anymore, sorry.</Typography>
    </PageTemplate>
  )
}
