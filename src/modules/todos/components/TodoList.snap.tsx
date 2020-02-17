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
        checked={false}
        divider={true}
        key="TodoItem.1"
        onCheckBoxToggle={[Function]}
        onDeleteButtonClick={[Function]}
        request={
          Object {
            "payload": Object {
              "completed": false,
              "id": 1,
              "text": "Todo 1",
            },
            "state": "inProgress",
            "type": "create",
          }
        }
        text="Todo 1"
      />
      <Memo()
        checked={false}
        divider={true}
        key="TodoItem.2"
        onCheckBoxToggle={[Function]}
        onDeleteButtonClick={[Function]}
        request={
          Object {
            "payload": Object {
              "completed": false,
              "id": 2,
              "text": "Todo 2",
            },
            "state": "inProgress",
            "type": "create",
          }
        }
        text="Todo 2"
      />
      <Memo()
        checked={false}
        divider={false}
        key="TodoItem.3"
        onCheckBoxToggle={[Function]}
        onDeleteButtonClick={[Function]}
        request={
          Object {
            "payload": Object {
              "completed": false,
              "id": 3,
              "text": "Todo 3",
            },
            "state": "inProgress",
            "type": "create",
          }
        }
        text="Todo 3"
      />
    </WithStyles(ForwardRef(List))>
  </WithStyles(ForwardRef(Paper))>
</Fragment>
`;
