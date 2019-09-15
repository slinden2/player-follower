import React from 'react'
import PageContainer from './elements/PageContainer'
import ContentWrapper from './elements/ContentWrapper'
import Link from './elements/StyledLink'
import Paragraph from './elements/Paragraph'

const NoMatchPage = ({ history }) => {
  if (history.location.pathname !== '/404') history.push('/404')

  return (
    <PageContainer title="404 - Page Not Found">
      <ContentWrapper>
        <Paragraph>
          Unfortunately we're not able to locate the page you are looking for.
        </Paragraph>
        <Paragraph>
          If you are looking for a specific player or a team, please take a look
          at our search page <Link name="here" to="/search" />.
        </Paragraph>
      </ContentWrapper>
    </PageContainer>
  )
}

export default NoMatchPage
