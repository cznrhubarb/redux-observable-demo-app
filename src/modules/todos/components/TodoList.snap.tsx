// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`TodoList matches snapshot 1`] = `
<Fragment>
  <WithStyles(ForwardRef(Paper))
    style={
      Object {
        "margin": 16,
      }
    }
  >
    <WithStyles(ForwardRef(List))
      style={
        Object {
          "overflow": "scroll",
        }
      }
    >
      <Memo()
        divider={true}
        item={
          Object {
            "data": Object {
              "completed": false,
              "id": 1,
              "text": "Todo 1",
            },
            "request": Object {
              "payload": Object {
                "completed": false,
                "id": 1,
                "text": "Todo 1",
              },
              "state": "success",
              "type": "create",
            },
          }
        }
        key="TodoItem.1"
        onCheckBoxToggle={[Function]}
        onDeleteButtonClick={[Function]}
      />
      <Memo()
        divider={true}
        item={
          Object {
            "data": Object {
              "completed": false,
              "id": 2,
              "text": "Todo 2",
            },
            "request": Object {
              "payload": Object {
                "completed": false,
                "id": 2,
                "text": "Todo 2",
              },
              "state": "success",
              "type": "create",
            },
          }
        }
        key="TodoItem.2"
        onCheckBoxToggle={[Function]}
        onDeleteButtonClick={[Function]}
      />
      <Memo()
        divider={false}
        item={
          Object {
            "data": Object {
              "completed": false,
              "id": 3,
              "text": "Todo 3",
            },
            "request": Object {
              "payload": Object {
                "completed": false,
                "id": 3,
                "text": "Todo 3",
              },
              "state": "success",
              "type": "create",
            },
          }
        }
        key="TodoItem.3"
        onCheckBoxToggle={[Function]}
        onDeleteButtonClick={[Function]}
      />
    </WithStyles(ForwardRef(List))>
  </WithStyles(ForwardRef(Paper))>
</Fragment>
`;
