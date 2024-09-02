const context = new AudioContext();

// 创建Oscillator 振荡器节点产生不同波形、频率的声音，
const osc = context.createOscillator();
osc.frequency.value = 220;
osc.type = 'square';
osc.start();

// Gain 节点调节音量
const volume = context.createGain();
volume.gain.value = 0.5;

// destination 节点播放声音
const out = context.destination;

const nodes = new Map();

nodes.set('oscNode', osc);
nodes.set('volNode', volume);
nodes.set('outNode', out);

export const isRunning = () => context.state === 'running';

/**
 * 切换音频播放状态
 *
 * 如果当前正在运行，则暂停音频上下文；否则恢复音频上下文。
 */
export const toggleAudio = () => {
  // 如果正在运行
  if (isRunning()) {
    // 暂停音频上下文
    context.suspend();
  } else {
    // 恢复音频上下文
    context.resume();
  }
};

/**
 * 更新音频节点
 *
 * @param id 节点ID
 * @param data 更新数据
 */
export const updateAudioNode = (id: string, data: Record<string, any>) => {
  const node = nodes.get(id);

  if (!node) {
    console.error(`Node with id ${id} not found.`);
    return;
  }

  // 遍历 data 对象的键值对
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];

      if (node[key] instanceof AudioParam) {
        // 如果 node[key] 是 AudioParam，则更新其值
        (node[key] as AudioParam).value = value;
      } else {
        // 否则，直接赋值给 node[key]
        node[key] = value;
      }
    }
  }
};

/**
 * 移除音频节点
 *
 * @param id 节点ID
 */
export const removeAudioNode = (id: string) => {
  // 获取节点
  const node = nodes.get(id);

  // 断开节点连接
  node?.disconnect();
  // 停止节点
  node.stop?.();

  // 删除节点
  nodes.delete(id);
};

/**
 * 连接两个节点
 *
 * @param sourceId 源节点ID
 * @param targetId 目标节点ID
 * @returns 无返回值
 */
export const connect = (sourceId: string, targetId: string) => {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);

  console.log('Connecting:', { sourceId, source, targetId, target });

  if (!source) {
    console.error(`Source node with id ${sourceId} not found.`);
    return;
  }
  if (!target) {
    console.error(`Target node with id ${targetId} not found.`);
    return;
  }

  source.connect(target);
};

/**
 * 断开两个节点的连接
 *
 * @param sourceId 源节点ID
 * @param targetId 目标节点ID
 */
export const disconnect = (sourceId: string, targetId: string) => {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);
  source.disconnect(target);
};

export const createAudioNode = (
  id: string,
  type: string,
  data: Record<string, any>
) => {
  console.log({ type, data });

  switch (type) {
    case 'osc': {
      const osc = context.createOscillator();
      osc.frequency.value = data.frequency;
      osc.type = data.type;
      osc.start();

      nodes.set(id, osc);
      break;
    }

    case 'vol': {
      const vol = context.createGain();
      vol.gain.value = data.gain;

      nodes.set(id, vol);
      break;
    }
  }
};
