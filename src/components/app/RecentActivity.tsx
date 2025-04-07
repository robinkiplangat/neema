
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle2, MessageSquare, FileEdit } from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "https://github.com/shadcn.png",
        initials: "AJ",
      },
      action: "completed a task",
      subject: "Homepage redesign",
      project: "Website Redesign",
      time: "2 hours ago",
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    },
    {
      id: 2,
      user: {
        name: "Emily Chen",
        avatar: "",
        initials: "EC",
      },
      action: "tracked time on",
      subject: "User Authentication",
      project: "Mobile App",
      time: "4 hours ago",
      icon: <Clock className="h-4 w-4 text-blue-500" />,
    },
    {
      id: 3,
      user: {
        name: "Sam Lee",
        avatar: "",
        initials: "SL",
      },
      action: "commented on",
      subject: "Analytics Dashboard",
      project: "Internal Dashboard",
      time: "Yesterday at 4:23 PM",
      icon: <MessageSquare className="h-4 w-4 text-purple-500" />,
    },
    {
      id: 4,
      user: {
        name: "Jordan Williams",
        avatar: "",
        initials: "JW",
      },
      action: "updated",
      subject: "Project timeline",
      project: "Marketing Campaign",
      time: "Yesterday at 11:36 AM",
      icon: <FileEdit className="h-4 w-4 text-orange-500" />,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                {activity.user.avatar ? (
                  <AvatarImage src={activity.user.avatar} />
                ) : null}
                <AvatarFallback className="bg-magnetic-100 text-magnetic-700">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-muted-foreground">{activity.action}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {activity.icon}
                  <p className="text-sm font-medium">
                    {activity.subject}{" "}
                    <span className="text-muted-foreground font-normal">
                      in {activity.project}
                    </span>
                  </p>
                </div>
                
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
