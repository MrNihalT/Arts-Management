from django.shortcuts import render
from rest_framework.permissions import AllowAny , IsAuthenticated

from accounts.permissions import IsAdminOrPrincipal , IsStudent
from complaints.models import Complaint
from complaints.serializers import ComplaintSerializer,ComplaintUpdateSerializer
# Create your views here.


class ComplaintListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsStudent,IsAuthenticated]
    serializer_class = ComplaintSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsStudent()]
        return [IsAuthenticated()]  


    def get_queryset(self):
        qs = Complaint.objects.select_related('user')
        user = self.request.user
        if user.role not in ['admin','principal']:
            qs = qs.filter(user=user)
        
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs   
    
    def perform_create(self,serializer):
        permission_classes = [IsStudent]
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)



class ComplaintDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Complaint.objects.select_related('user')

    def get_serializer_class(self):
        if self.request.method in ['PUT','PATCH']:
            return ComplaintUpdateSerializer
        return ComplaintSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdminOrPrincipal()]
    
    