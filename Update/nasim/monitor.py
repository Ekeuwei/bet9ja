
packetsDb = np.empty((0,11))
head = ['Sa', 'SPn', 'SWs', 'Da', 'DPn', 'DWs', 'App', 'src_conflg', 'dst_conflag', 'Time', 'Bytes']
packetsDb = updateDb_v2(head, packetsDb)

def print_conversation_header(capture):
    global packetsDb
    # print(capture)
    if capture.transport_layer == "TCP":
        #print('TCP')
        # 'Sa', 'SPn' 'SWs' 'Da', 'DPn', 'DWs', 'App'
        src_addr = capture.ip.src
        src_port = capture[capture.transport_layer].srcport
        src_win = capture.tcp.window_size
        dst_addr = capture.ip.dst
        dst_port = capture[capture.transport_layer].dstport
        dst_win = capture.tcp.window_size
        protocol =  capture.transport_layer
        length = capture.length
        #src_len = capture.len
        #print(src_len)

        packet = np.array([src_addr, src_port, src_win, dst_addr, dst_port, dst_win, protocol, '0', '0', time_mill(), length])

        packetsDb = updateDb_v2(trafficLabel(packet), packetsDb)

        print(packetsDb)
    else:
        print('Non - TCP Packets')

capture.apply_on_packets(print_conversation_header, timeout=100)
