from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Participation
from .serializers import ParticipationSerializer


class ParticipationListView(generics.ListAPIView):
    queryset = Participation.objects.all()
    serializer_class = ParticipationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ["admin", "principal","teacher","judge"]:
            return Participation.objects.all()
        print(self.request.user.username,"is asking")
        return Participation.objects.filter(user=self.request.user)


class ParticipationDetailView(generics.RetrieveAPIView):

    queryset = Participation.objects.all()
    serializer_class = ParticipationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Participation.objects.filter(user=self.request.user)


class ParticipationByProgramView(generics.ListAPIView):
    queryset = Participation.objects.all()
    serializer_class = ParticipationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ["admin", "principal","teacher","judge"]:
            return Participation.objects.filter(program=self.kwargs['pk'])
        return Participation.objects.filter(user=self.request.user,program=self.kwargs['pk'])