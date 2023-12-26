import React, { useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';

function App() {
  const [email, setEmail] = useState('');
  const [allowed, setAllowed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    // Set allowed to true if the submission is successful
    setAllowed(true);
  };

  return (
    <div className="App">
      <Container>
        <h2>Jacqueline Taylor and Friends</h2>
        <Form
          onSubmit={handleSubmit}
          style={{ display: allowed ? 'none' : 'block' }}
        >
          <FormGroup>
            <Label for="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <Button color="primary" type="submit">
            Join
          </Button>
        </Form>

        <div style={{ display: allowed ? 'block' : 'none' }}>
          <div id="JTF-containter" style={{ height: '700px' }}></div>
        </div>
      </Container>
    </div>
  );
}

export default App;
