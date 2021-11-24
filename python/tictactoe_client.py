from __future__ import print_function

import grpc
import mpg_pb2
import mpg_pb2_grpc
import logging


def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = mpg_pb2_grpc.TicTacToeStub(channel)
        response = stub.PlayTurn(mpg_pb2.SendMyMove(myMove='1'))
    print("Hello player: " + response.opponentMove)

if __name__ == '__main__':
    logging.basicConfig()
    run()