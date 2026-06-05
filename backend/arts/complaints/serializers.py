from rest_framework import serializers

from complaints.models import Complaint


class ComplaintSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = ['id','user','user_name','title','description','email','message','attachment','status','response','created_at','updated_at']

        read_only_fields = ['id','user','status','response','created_at','updated_at']

    def get_user_name(self,obj):
        if not obj.user:
            return None
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username


class ComplaintUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['status','response']




    
        