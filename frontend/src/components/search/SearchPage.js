import React from 'react'
import SearchField from './SearchField'
import PageContainer from '../elements/PageContainer'

const SearchPage = () => {
  return (
    <PageContainer title={'Search players & teams'} center>
      <SearchField noNav />
    </PageContainer>
  )
}

export default SearchPage
