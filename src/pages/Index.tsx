import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

type TaskStatus = "pending" | "in_progress" | "completed";

interface Task {
  id: string;
  cargo: string;
  weight: string;
  volume: string;
  quantity: string;
  organization: string;
  address: string;
  schedule: string;
  contacts: string;
  additionalInfo: string;
  status: TaskStatus;
  taskDate: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("in_progress");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      cargo: "Строительные материалы",
      weight: "2500 кг",
      volume: "15 м³",
      quantity: "25 мест",
      organization: "ООО СтройТорг",
      address: "г. Москва, ул. Промышленная, д. 12",
      schedule: "Пн-Пт: 9:00-18:00",
      contacts: "+7 (495) 123-45-67",
      additionalInfo: "Требуется разгрузка краном",
      status: "pending",
      taskDate: "2025-10-25",
      startTime: "09:00",
      endTime: "12:00",
      createdAt: new Date(),
    },
    {
      id: "2",
      cargo: "Офисная мебель",
      weight: "850 кг",
      volume: "8 м³",
      quantity: "12 мест",
      organization: "ИП Петров А.В.",
      address: "г. Москва, Ленинский проспект, д. 45",
      schedule: "Пн-Сб: 10:00-20:00",
      contacts: "+7 (495) 987-65-43",
      additionalInfo: "Хрупкий груз, осторожная погрузка",
      status: "in_progress",
      taskDate: "2025-10-24",
      startTime: "10:00",
      endTime: "14:00",
      createdAt: new Date(),
    },
  ]);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    cargo: "",
    weight: "",
    volume: "",
    quantity: "",
    organization: "",
    address: "",
    schedule: "",
    contacts: "",
    additionalInfo: "",
    taskDate: "",
    startTime: "",
    endTime: "",
    status: "pending",
  });

  const { toast } = useToast();

  const handleCreateTask = () => {
    if (!newTask.cargo || !newTask.organization || !newTask.address || !newTask.taskDate) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля: Груз, Организация, Адрес, Дата задания",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      cargo: newTask.cargo || "",
      weight: newTask.weight || "",
      volume: newTask.volume || "",
      quantity: newTask.quantity || "",
      organization: newTask.organization || "",
      address: newTask.address || "",
      schedule: newTask.schedule || "",
      contacts: newTask.contacts || "",
      additionalInfo: newTask.additionalInfo || "",
      taskDate: newTask.taskDate || "",
      startTime: newTask.startTime || "",
      endTime: newTask.endTime || "",
      status: "pending",
      createdAt: new Date(),
    };

    setTasks([task, ...tasks]);
    setNewTask({
      cargo: "",
      weight: "",
      volume: "",
      quantity: "",
      organization: "",
      address: "",
      schedule: "",
      contacts: "",
      additionalInfo: "",
      taskDate: "",
      startTime: "",
      endTime: "",
      status: "pending",
    });

    toast({
      title: "Задание создано",
      description: `Задание для ${task.organization} успешно добавлено`,
    });
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)));
    toast({
      title: "Статус обновлён",
      description: "Статус задания успешно изменён",
    });
  };

  const getStatusBadge = (status: TaskStatus) => {
    const statusConfig = {
      pending: { label: "Ожидает", color: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
      in_progress: { label: "В работе", color: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
      completed: { label: "Завершено", color: "bg-green-100 text-green-700 hover:bg-green-100" },
    };

    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const navItems = [
    { id: "in_progress", label: "Задания в работе", icon: "Truck", status: "in_progress" as TaskStatus },
    { id: "completed", label: "Задания завершены", icon: "CheckCircle2", status: "completed" as TaskStatus },
    { id: "pending", label: "Задания плановые", icon: "Calendar", status: "pending" as TaskStatus },
  ];

  const filteredTasks = tasks.filter((task) => {
    const currentNav = navItems.find((item) => item.id === activeTab);
    return currentNav ? task.status === currentNav.status : true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Truck" size={28} className="text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Система управления доставками</h1>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Icon name="Plus" size={18} />
                  Создать задание
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Новое задание для водителя</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Груз *</Label>
                      <Input
                        id="cargo"
                        value={newTask.cargo}
                        onChange={(e) => setNewTask({ ...newTask, cargo: e.target.value })}
                        placeholder="Название груза"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Вес</Label>
                      <Input
                        id="weight"
                        value={newTask.weight}
                        onChange={(e) => setNewTask({ ...newTask, weight: e.target.value })}
                        placeholder="напр. 1500 кг"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="volume">Объём</Label>
                      <Input
                        id="volume"
                        value={newTask.volume}
                        onChange={(e) => setNewTask({ ...newTask, volume: e.target.value })}
                        placeholder="напр. 10 м³"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Количество мест</Label>
                      <Input
                        id="quantity"
                        value={newTask.quantity}
                        onChange={(e) => setNewTask({ ...newTask, quantity: e.target.value })}
                        placeholder="напр. 15 мест"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Наименование организации *</Label>
                    <Input
                      id="organization"
                      value={newTask.organization}
                      onChange={(e) => setNewTask({ ...newTask, organization: e.target.value })}
                      placeholder="ООО Компания"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес *</Label>
                    <Input
                      id="address"
                      value={newTask.address}
                      onChange={(e) => setNewTask({ ...newTask, address: e.target.value })}
                      placeholder="Полный адрес доставки"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule">График работы</Label>
                    <Input
                      id="schedule"
                      value={newTask.schedule}
                      onChange={(e) => setNewTask({ ...newTask, schedule: e.target.value })}
                      placeholder="напр. Пн-Пт: 9:00-18:00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contacts">Контакты</Label>
                    <Input
                      id="contacts"
                      value={newTask.contacts}
                      onChange={(e) => setNewTask({ ...newTask, contacts: e.target.value })}
                      placeholder="+7 (XXX) XXX-XX-XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskDate">Дата задания *</Label>
                    <Input
                      id="taskDate"
                      type="date"
                      value={newTask.taskDate}
                      onChange={(e) => setNewTask({ ...newTask, taskDate: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Время начала</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newTask.startTime}
                        onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">Время окончания</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newTask.endTime}
                        onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Дополнительная информация</Label>
                    <Textarea
                      id="additionalInfo"
                      value={newTask.additionalInfo}
                      onChange={(e) => setNewTask({ ...newTask, additionalInfo: e.target.value })}
                      placeholder="Особые требования, примечания..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleCreateTask}>Создать задание</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <nav className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === item.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={item.icon as any} size={18} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {navItems.find((item) => item.id === activeTab)?.label} ({filteredTasks.length})
            </h2>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Заданий пока нет</h3>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{task.cargo}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon name="Building2" size={14} />
                          {task.organization}
                        </div>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Icon name="CalendarDays" size={16} className="text-primary" />
                          <div className="text-sm">
                            <div className="text-muted-foreground text-xs">Дата задания</div>
                            <div className="font-semibold text-foreground">
                              {task.taskDate
                                ? new Date(task.taskDate).toLocaleDateString("ru-RU", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "Не указана"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" size={16} className="text-accent" />
                          <div className="text-sm">
                            <div className="text-muted-foreground text-xs">Время начала</div>
                            <div className="font-semibold text-foreground">{task.startTime || "Не указано"}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" size={16} className="text-destructive" />
                          <div className="text-sm">
                            <div className="text-muted-foreground text-xs">Время окончания</div>
                            <div className="font-semibold text-foreground">{task.endTime || "Не указано"}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Icon name="Package" size={16} className="mt-0.5 text-muted-foreground" />
                          <div className="text-sm">
                            <div className="text-muted-foreground">Параметры груза</div>
                            <div className="font-medium">
                              {task.weight && `${task.weight}`}
                              {task.volume && ` • ${task.volume}`}
                              {task.quantity && ` • ${task.quantity}`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Icon name="MapPin" size={16} className="mt-0.5 text-muted-foreground" />
                          <div className="text-sm">
                            <div className="text-muted-foreground">Адрес доставки</div>
                            <div className="font-medium">{task.address}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Icon name="Clock" size={16} className="mt-0.5 text-muted-foreground" />
                          <div className="text-sm">
                            <div className="text-muted-foreground">График работы</div>
                            <div className="font-medium">{task.schedule || "Не указан"}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Icon name="Phone" size={16} className="mt-0.5 text-muted-foreground" />
                          <div className="text-sm">
                            <div className="text-muted-foreground">Контакты</div>
                            <div className="font-medium">{task.contacts || "Не указаны"}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {task.additionalInfo && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-md">
                        <div className="flex items-start gap-2">
                          <Icon name="Info" size={16} className="mt-0.5 text-muted-foreground" />
                          <div className="text-sm">
                            <div className="text-muted-foreground mb-1">Дополнительная информация</div>
                            <div>{task.additionalInfo}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTaskStatus(task.id, "pending")}
                        disabled={task.status === "pending"}
                      >
                        В ожидании
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTaskStatus(task.id, "in_progress")}
                        disabled={task.status === "in_progress"}
                      >
                        В работу
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTaskStatus(task.id, "completed")}
                        disabled={task.status === "completed"}
                      >
                        Завершить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;