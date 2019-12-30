import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Appointments should be rendered correctly on grouped agenda `
    .page(url(__dirname, '../../container.html'));

test("Drag-n-drop between dateTable and allDay panel, groupByDate=true", async t => {
    const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment("Website Re-Design Plan");

    await t
        .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(1))
        .expect(draggableAppointment.size.width).eql("111px")
        .expect(draggableAppointment.isAllDay).ok();

}).before(() => createScheduler({
    dataSource: dataSource,
    groupByDate: true
}));