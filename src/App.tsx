import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, MiniMap, Node, Panel, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { OscillatorNode } from './components/OscillatorNode';
import { VolumeNode } from './components/VolumeNode';
import { OutputNode } from './components/OutputNode';
import { connect, createAudioNode, removeAudioNode, disconnect } from './utils/audio';

const initialNodes: Node[] = [
  {
    id: 'oscNode',
    position: { x: 200, y: 0 },
    data: { frequency: 220, type: 'square' },
    type: 'osc'
  },
  {
    id: 'volNode',
    position: { x: 150, y: 250 },
    data: { gain: 0.5 },
    type: 'vol'
  },
  {
    id: 'outNode',
    position: { x: 350, y: 400 },
    data: {},
    type: 'out'
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  'osc': OscillatorNode,
  'vol': VolumeNode,
  'out': OutputNode,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => {
    connect(params.source, params.target);
    setEdges((eds) => addEdge(params, eds))
    // const sourceNode = initialNodes.find(node => node.id === params.source);
    // const targetNode = initialNodes.find(node => node.id === params.target);
    // console.log({ sourceNode, targetNode, params });

    // if (sourceNode && targetNode) {
    //   createAudioNode(params.source, sourceNode.type, sourceNode.data);
    //   createAudioNode(params.target, targetNode.type, targetNode.data);

    //   connect(params.source, params.target);
    //   setEdges((eds) => addEdge(params, eds));
    // }
  }

  const addOscNode = () => {
    const id = Math.random().toString().slice(2, 8)
    const position = { x: 0, y: 0 }
    const type = 'osc';
    const data = { frequency: 400, type: 'sine' };

    setNodes([...nodes, { id, position, type, data }]);
    createAudioNode(id, type, data);
  }

  const addVolNode = () => {
    const id = Math.random().toString().slice(2, 8)
    const position = { x: 0, y: 0 }
    const type = 'vol';
    const data = { gain: 0.5 };

    setNodes([...nodes, { id, position, type, data }]);
    createAudioNode(id, type, data);
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={(nodes) => {
          for (const { id } of nodes) {
            removeAudioNode(id);
          }
        }}
        onEdgesDelete={(edges) => {
          for (const { source, target } of edges) {
            disconnect(source, target);
          }
        }}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Lines} />
        <Panel
          className='space-x-4'
          position='top-right'
        >
          <button className='p-[4px] rounded bg-blue-500 text-white shadow' onClick={addOscNode}>
            添加振荡器节点
          </button>
          <button className='p-[4px] rounded bg-blue-500 text-white shadow' onClick={addVolNode}>
            添加音量节点
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
