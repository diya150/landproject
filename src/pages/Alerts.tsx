import { Bell, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { SeverityBadge } from '../components/dashboard/SeverityBadge';
import { mockAlerts } from '../lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function Alerts() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'violation':
        return AlertTriangle;
      case 'system':
        return Info;
      case 'compliance':
        return Bell;
      case 'risk':
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-amber-200 bg-amber-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-slate-200 bg-white';
    }
  };

  const unreadCount = mockAlerts.filter(a => !a.isRead).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Alerts & Notifications</h1>
          <p className="text-slate-600">Real-time monitoring and system notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
            <Bell className="h-4 w-4 text-red-600" />
            <span className="text-sm font-semibold text-red-900">{unreadCount} Unread</span>
          </div>
          <Button variant="outline">Mark All as Read</Button>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-700">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700">Warnings</p>
                <p className="text-2xl font-bold text-amber-900">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Info</p>
                <p className="text-2xl font-bold text-blue-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Resolved Today</p>
                <p className="text-2xl font-bold text-green-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b border-slate-200 px-6 pt-4">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="all">All Alerts</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="divide-y divide-slate-200">
                {mockAlerts.map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className={`p-6 hover:bg-slate-50 transition-colors ${
                        !alert.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          alert.severity === 'critical' ? 'bg-red-100' :
                          alert.severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            alert.severity === 'critical' ? 'text-red-600' :
                            alert.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                          }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                              {!alert.isRead && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <SeverityBadge severity={alert.severity} size="sm" />
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-3">
                            {alert.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                              {alert.plotId && (
                                <span className="font-medium text-[#059669]">
                                  Plot: {alert.plotId}
                                </span>
                              )}
                              <span className="capitalize">{alert.type} Alert</span>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {!alert.isRead && (
                                <Button variant="ghost" size="sm">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Mark Read
                                </Button>
                              )}
                              <Button variant="ghost" size="sm">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              <div className="divide-y divide-slate-200">
                {mockAlerts.filter(a => !a.isRead).map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className="p-6 bg-blue-50/30 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          alert.severity === 'critical' ? 'bg-red-100' :
                          alert.severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            alert.severity === 'critical' ? 'text-red-600' :
                            alert.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                          }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <SeverityBadge severity={alert.severity} size="sm" />
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-3">
                            {alert.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                              {alert.plotId && (
                                <span className="font-medium text-[#059669]">
                                  Plot: {alert.plotId}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Read
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="critical" className="m-0">
              <div className="divide-y divide-slate-200">
                {mockAlerts.filter(a => a.severity === 'critical').map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className="p-6 bg-red-50/30 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-red-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                            <SeverityBadge severity={alert.severity} size="sm" />
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-3">
                            {alert.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                              {alert.plotId && (
                                <span className="font-medium text-[#059669]">
                                  Plot: {alert.plotId}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button className="bg-red-600 hover:bg-red-700 text-white" size="sm">
                                Take Action
                              </Button>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}