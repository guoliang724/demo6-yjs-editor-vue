## Core Steps of Using Yjs:

### ① Create a Document (Y.Doc)

This is the root container for all collaborative data.

```js
import * as Y from "yjs";

const ydoc = new Y.Doc();
```

Y.Doc represents the entire collaborative state.

### ② Create Your Shared Data Types (Shared Types)

You need to tell Yjs what your collaborative data structure looks like.

For example:

- Using text:

```js
const ytext = ydoc.getText("content");
```

- Using an array:

```js
const yarray = ydoc.getArray("shapes");
```

- Using a Map:

```js
const ymap = ydoc.getMap("meta");
```

At this point you already have a collaborative data structure, but it exists only locally.

### ③ Connect to a Collaboration Provider

The provider is the actual core of collaboration—it synchronizes the document across clients.

You can use:

- y-websocket

- y-webrtc

- y-indexeddb (offline persistence)

Your company’s own custom provider (internal protocol)

Example with WebSocket:

```js
import { WebsocketProvider } from "y-websocket";

const provider = new WebsocketProvider("ws://localhost:1234", "room-id", ydoc);
```

After connecting:

The provider automatically sends updates from ydoc to the server

And receives updates from other clients

### ④ Bind Shared Types to the UI (Binding)

- This step makes your UI react to collaborative changes.

- For example, using y-prosemirror / y-quill / custom bindings:

```
ytext.observe(event => {
  console.log('text changed:', ytext.toString())
})
```

Or in a drawing application:

```
yarray.observe(event => {
  renderShapes(yarray.toArray())
})
```

Any client modifying yarray, ytext, or ymap will automatically sync to all other clients.

### ⑤ Edit the Data Locally (Modify Shared Types)

Examples:

Edit text:

```
ytext.insert(0, "Hello")

```

Operate on an array:

```
yarray.push([{ id: 1, x: 100, y: 200 }])
```

Modify a Map:

```
ymap.set('username', 'Leon')
```

All operations:

- Are recorded into the local Y.Doc

- Automatically sync to others through the provider

- Have conflicts handled by CRDTs (no need for locks or manual merging)

✅ Summary of the Yjs Workflow:

Create Doc → Define Shared Types → Connect Provider → Bind to UI → Modify Data → Auto Sync

### Demos:

quill-editor
![](./public/images/q-editor.gif)


yjs-editor
