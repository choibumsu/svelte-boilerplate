<script>
  import { Router, Route, Link } from 'svelte-routing'
  import Main from '@pages/Main'
  import Document from '@pages/Document'
  import Example from '@pages/Example'
</script>

<style lang="scss">
  @media (min-width: 640px) {
  }
</style>

<Router>
  <nav>
    <Link to="/">Main</Link>
    <Link to="document">Document</Link>
    <Link to="example">Example</Link>
  </nav>

  <Route path="/">
    <Main />
  </Route>
  <Route path="document">
    <Document />
  </Route>
  <Route path="example">
    <Example />
  </Route>
</Router>
