import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
    Redirect
} from "react-router-dom";
import moment from 'moment';
import 'moment/locale/ko';

moment.locale('ko');

class Privacy extends Component {
    constructor(props) {
        super(props);
        this.state     = {
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const {} = this.state;
        const {} = this.props;
        return (
            <div style={{textAlign:'left',fontSize:'13px'}}>
                <pre><h5>개인정보 처리방침</h5>
                    {`
인증번호 도움 어플리케이션 캐쳐(이하 "캐쳐")의 개인정보취급방침은 다음과 같은 내용을 담고 있습니다.

    가. 수집하는 개인정보 항목 및 수집방법
    나. 개인정보의 수집 및 이용목적
    다. 수집한 개인정보의 공유 및 제공
    라. 개인정보취급 위탁
    마. 수집한 개인정보의 보유 및 이용기간 / 개인정보 파기절차 및 방법
    바. 이용자 및 법정대리인의 권리와 그 행사방법
    사. 개인정보 관리책임자 및 담당자의 소속-성명 및 연락처


가. 수집하는 개인정보 항목 및 수집방법

    캐쳐는 회원가입, 상담, 서비스 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
        ▶ 이름(혹은 닉네임), 이메일, '인증' 및 'verification' 내용이 포함된 문자 메세지 내용

    또한 서비스 이용과정이나 사업 처리 과정에서 아래와 같은 정보들이 생성되어 수집될 수 있습니다.
        ▶ 서비스 이용기록, 접속 로그

    캐쳐는 다음과 같은 방법으로 개인정보를 수집합니다.
        ▶ 어플리케이션을 통한 회원가입


나. 개인정보 수집 및 이용목적

    캐쳐는 수집한 개인정보를 다음의 두가지 서비스 제공을 위해 활용합니다.
        ▶ 웹/앱 본인인증 내역 확인 서비스, 웹 본인인증 메세지 푸시 연동


다. 개인정보의 공유 및 제공

    캐쳐는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
    다만, 아래의 경우에는 예외로 합니다.
        - 이용자들이 사전에 동의한 경우
        - 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우


라. 수집한 개인정보 취급 위탁

    캐쳐는 고객님의 동의없이 고객님의 개인정보 취급을 외부 업체에 위탁하지 않습니다.
    향후 그러한 필요가 생길 경우, 위탁 대상자와 위탁 업무 내용에 대해 고객님에게 통지하고
    필요한 경우 사전 동의를 받도록 하겠습니다.


마. 수집한 개인정보의 보유 및 이용기간 / 개인정보 파기절차 및 방법

    원칙적으로, 개인정보 수집 및 이용목적이 달성하거나 회원의 요청에 의한 경우 해당 정보를 지체없이 파기합니다.
    파기절차 및 방법은 다음과 같습니다.
        ▶ 파기절차
        - 회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조)
        일정 기간 저장된 후 파기되어집니다. 동 개인정보는 법률에 의한 경우가 아니고서는 보유되어지는 이외의 다른 목적으로 이용되지 않습니다.
        ▶ 파기방법
        - 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기
        - 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.

    단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
        ▶ 회원 이메일 [내부 방침에 의한 정보보유 사유]
        - 보존 이유 : 서비스 이용의 혼선방지
        - 보존 기간 : 회원 탈퇴 이후 6개월


바. 이용자 및 법정 대리인의 권리와 그 행사방법

    이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만아동의 개인정보를
    조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.

    이용자 혹은 만 14세 미만 아동의 개인정보 조회․수정을 위해서는 ‘개인정보변경’(또는 ‘회원정보수정’ 등)을
    가입해지(동의철회)를 위해서는 “회원탈퇴”를 클릭하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다.
    혹은 개인정보관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체없이 조치하겠습니다.

    귀하가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다.
    또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체없이 통지하여 정정이 이루어지도록 하겠습니다.

    캐쳐는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된 개인정보는 “캐쳐가 수집하는 개인정보의 보유 및 이용기간”에
    명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.


사. 개인정보 관리 책임자

    캐쳐는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여
    아래와 같이 관련 부서 및 개인정보관리책임자를 지정하고 있습니다.
        ▶ 개인정보관리책임자
        성명 : 강현구
        전화번호 : 010 9688 1157
        이메일 : gusrn1423@naver.com


귀하께서는 캐쳐 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보관리책임자에게 신고하실 수 있습니다.
캐쳐는 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.

공고일자 : 2018년 06월 29일
시행일자 : 2018년 07월 07일
                `}
                </pre>
            </div>
        )
    }
}

export default Privacy