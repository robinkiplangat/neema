import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, TrendingUp, TrendingDown, Minus, Coffee, 
  Clock, Calendar, Target
} from "lucide-react";
import * as productivityService from '@/services/productivityService';
import { useAI } from '@/context/AIContext';

const ProductivityInsightsTab = () => {
  const { user } = useUser();
  const userId = user?.id || '';
  const { neemaContext, isContextLoading, refreshContext } = useAI();
  const [productivityTrends, setProductivityTrends] = useState<productivityService.ProductivityTrend[]>([]);
  const [focusSessions, setFocusSessions] = useState<productivityService.FocusSession[]>([]);
  const [productivityInsights, setProductivityInsights] = useState<{
    topPerformingHours: { hour: number; score: number }[];
    contextSwitchingFrequency: number;
    focusSessionAvgDuration: number;
    taskCompletionRate: number;
    insights: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const [trends, sessions, insights] = await Promise.all([
            productivityService.fetchProductivityTrends(userId, 7),
            productivityService.fetchFocusSessions(userId),
            productivityService.fetchProductivityInsights(userId)
          ]);
          
          setProductivityTrends(trends);
          setFocusSessions(sessions);
          setProductivityInsights(insights);
        } catch (error) {
          console.error('Error loading productivity data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
  }, [userId]);
  
  const renderTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  if (isLoading || isContextLoading) {
    return <div className="flex items-center justify-center h-64">Loading productivity insights...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Productivity Insights Banner */}
      <Card className="bg-gradient-to-r from-pastel-lightpink/20 to-pastel-mint/20 border-pastel-lightpink/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-pastel-lightpink/30 rounded-full p-2">
              <Lightbulb className="h-5 w-5 text-pastel-darkpink" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Productivity Insights</h3>
              <p className="text-sm text-muted-foreground">
                {productivityInsights?.insights?.[0] || 
                 "Your focus time has increased this week. You complete tasks most efficiently in the morning."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {neemaContext.productivityStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {stat.title}
                {renderTrendIcon(stat.trend)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}{stat.unit}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  vs target {stat.target}{stat.unit}
                </div>
                <Badge variant={stat.trend === 'up' ? 'default' : 'outline'} className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    stat.trend === 'up' ? 'bg-green-500' : 
                    stat.trend === 'down' ? 'bg-red-500' : 'bg-amber-500'
                  }`} 
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Productivity Trends</CardTitle>
            <CardDescription>Your productivity metrics over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="focusTime" 
                    name="Focus Time"
                    stroke="#8884d8" 
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="taskCompletion" 
                    name="Task Completion"
                    stroke="#82ca9d" 
                    fill="#82ca9d"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Time Distribution</CardTitle>
            <CardDescription>How you spend your working hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={neemaContext.timeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="percentage"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {neemaContext.timeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color.replace('bg-', '#') || '#' + Math.floor(Math.random()*16777215).toString(16)} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Productive Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Productive Hours</CardTitle>
          <CardDescription>When you're most efficient throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityInsights?.topPerformingHours.map(h => ({
                hour: `${h.hour}:00`,
                score: h.score
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" name="Productivity Score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Focus Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Duration:</span>
                <span className="font-bold">{Math.round(productivityInsights?.focusSessionAvgDuration || 0)} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sessions This Week:</span>
                <span className="font-bold">{focusSessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Most Productive Category:</span>
                <Badge>Development</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span>Task Effectiveness</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completion Rate:</span>
                <span className="font-bold">{productivityInsights?.taskCompletionRate || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Context Switching:</span>
                <span className="font-bold">{productivityInsights?.contextSwitchingFrequency || 0} times/hour</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Deep Work Sessions:</span>
                <span className="font-bold">{focusSessions.filter(s => (s.duration || 0) > 45).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductivityInsightsTab; 