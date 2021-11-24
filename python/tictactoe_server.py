from concurrent import futures

import grpc
import mpg_pb2
import mpg_pb2_grpc
import logging

class TicTacToe(mpg_pb2_grpc.TicTacToeServicer):
    def PlayTurn(self, request, context):
        return mpg_pb2.SendOpponentMove(opponentMove= "Previous move was at %s " % request.myMove)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    mpg_pb2_grpc.add_TicTacToeServicer_to_server(TicTacToe(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    logging.basicConfig()
    serve()