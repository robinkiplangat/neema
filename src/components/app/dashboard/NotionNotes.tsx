import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Plus, ExternalLink } from "lucide-react";

// Mock data for Notion notes
const mockNotes = [
  {
    id: "1",
    title: "Project Planning - Q2",
    lastEdited: "2 hours ago",
    icon: "📊",
    url: "https://notion.so/example1"
  },
  {
    id: "2",
    title: "Meeting Notes - Client Call",
    lastEdited: "Yesterday",
    icon: "📝",
    url: "https://notion.so/example2"
  },
  {
    id: "3",
    title: "Product Roadmap",
    lastEdited: "3 days ago",
    icon: "🗺️",
    url: "https://notion.so/example3"
  },
  {
    id: "4",
    title: "Research Findings",
    lastEdited: "1 week ago",
    icon: "🔍",
    url: "https://notion.so/example4"
  }
];

const NotionNotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredNotes = mockNotes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card className="border shadow-sm bg-white/80 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span>Notion Notes</span>
          </CardTitle>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{note.icon}</span>
                <div>
                  <div className="font-medium">{note.title}</div>
                  <div className="text-xs text-muted-foreground">{note.lastEdited}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {filteredNotes.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No notes found
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="link" className="w-full justify-start text-sm">
            View all notes in Notion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotionNotes; 